// routes/trips.ts
import { Router } from "express";
import { Trip } from "../models/trip";
import { BusScheduleModel, RouteModel, BusModel } from "../models/bus"; // Adjust import path as needed
import auth, { authorizeRoles } from '../middleware/auth'; // Import auth and authorizeRoles

const router = Router();

// Get all trips with search functionality
router.get("/" , async (req, res) => {
  try {
    const { from, to, date, page = 1, limit = 10 } = req.query;

    if (from && to && date) {
      const searchDate = new Date(date as string);
      searchDate.setHours(0, 0, 0, 0);

      // Find routes that contain both 'from' and 'to' stops
      const routes = await RouteModel.find({
        $and: [
          { 'stops.name': { $regex: new RegExp(from as string, 'i') } },
          { 'stops.name': { $regex: new RegExp(to as string, 'i') } }
        ]
      });

      // Filter routes where 'from' comes before 'to' in sequence
      const validRoutes = routes.filter(route => {
        const fromStop = route.stops.find(stop => 
          stop.name.toLowerCase().includes((from as string).toLowerCase())
        );
        const toStop = route.stops.find(stop => 
          stop.name.toLowerCase().includes((to as string).toLowerCase())
        );
        return fromStop && toStop && fromStop.sequence < toStop.sequence;
      });

      if (validRoutes.length === 0) {
        return res.json({
          trips: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalTrips: 0,
            hasNext: false,
            hasPrev: false
          }
        });
      }

      const routeIds = validRoutes.map(r => r._id);

      // Check for existing trips
      let existingTrips = await Trip.find({
        route: { $in: routeIds },
        date: searchDate,
      })
        .populate({
          path: 'bus',
          match: { status: 'active' },
          select: 'model registrationNumber type seats amenities rating status'
        })
        .populate({
          path: 'route',
          select: 'name stops'
        })
        .populate({
          path: 'schedule',
          match: { status: 'active' },
          select: 'endTime startTime price operatingDays status'
        })
        .sort({ 'schedule.departureTime': 1 });

      // Filter out trips with null populated fields (inactive records)
      existingTrips = existingTrips.filter(trip => 
        trip.bus && trip.schedule && trip.availableSeats > 0
      );

      if (existingTrips.length > 0) {
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedTrips = existingTrips.slice(startIndex, endIndex);

        return res.json({
          trips: paginatedTrips,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(existingTrips.length / Number(limit)),
            totalTrips: existingTrips.length,
            hasNext: endIndex < existingTrips.length,
            hasPrev: startIndex > 0
          }
        });
      }

      // Create new trips if none exist
      const dayOfWeek = searchDate.getDay();
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[dayOfWeek];

      const schedules = await BusScheduleModel.find({
        routeId: { $in: routeIds },
        operatingDays: dayName,
        status: 'active'
      })
        .populate({
          path: 'busId',
          match: { status: 'active' },
          select: 'model registrationNumber type seats amenities rating status'
        })
        .populate({
          path: 'routeId',
          select: 'name stops basePrice distance'
        });

      const activeSchedules = schedules.filter(s => s.busId);

      if (activeSchedules.length === 0) {
        return res.json({
          trips: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalTrips: 0,
            hasNext: false,
            hasPrev: false
          }
        });
      }

      const newTripsData = activeSchedules.map(s => ({
        bus: (s.busId as any)._id,
        route: (s.routeId as any)._id,
        schedule: s._id,
        price: s.price, // Add price from schedule
        date: searchDate,
        availableSeats: (s.busId as any).seats,
        bookedSeats: [],
      }));

      const createdTrips = await Trip.insertMany(newTripsData);

      const populatedTrips = await Trip.find({ 
        _id: { $in: createdTrips.map(j => j._id) } 
      })
        .populate({
          path: 'bus',
          select: 'model registrationNumber type seats amenities rating status'
        })
        .populate({
          path: 'route',
          select: 'name stops'
        })
        .populate({
          path: 'schedule',
          select: 'endTime startTime  operatingDays status price'
        })
        .sort({ 'schedule.departureTime': 1 });

      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedTrips = populatedTrips.slice(startIndex, endIndex);

      return res.json({
        trips: paginatedTrips,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(populatedTrips.length / Number(limit)),
          totalTrips: populatedTrips.length,
          hasNext: endIndex < populatedTrips.length,
          hasPrev: startIndex > 0
        }
      });
    }

    // Default: return recent trips with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const trips = await Trip.find()
      .populate({
        path: 'bus',
        match: { status: 'active' },
        select: 'model registrationNumber type seats amenities rating status'
      })
      .populate({
        path: 'route',
        select: 'name stops'
      })
      .populate({
        path: 'schedule',
        match: { status: 'active' },
        select: 'endTime startTime price operatingDays status'
      })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const filteredTrips = trips.filter(trip => trip.bus && trip.schedule);
    const totalTrips = await Trip.countDocuments();

    res.json({
      trips: filteredTrips,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalTrips / Number(limit)),
        totalTrips,
        hasNext: skip + Number(limit) < totalTrips,
        hasPrev: skip > 0
      }
    });

  } catch (err: unknown) {
    console.error("Error fetching trips:", err);
    if (err instanceof Error) {
      res.status(500).json({ 
        message: "Failed to fetch trips",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// Get a single trip by ID
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate({
        path: 'bus',
        select: 'model seatLayout registrationNumber type seats amenities status'
      })
      .populate({
        path: 'route',
        select: 'name stops'
      })
      .populate({
        path: 'schedule',
        select: 'endTime startTime duration operatingDays status price'
      });


    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (!trip.bus || (trip.bus as any).status !== 'active') {
      return res.status(404).json({ message: "Trip not available - bus inactive" });
    }

    if (!trip.schedule || (trip.schedule as any).status !== 'active') {
      return res.status(404).json({ message: "Trip not available - schedule inactive" });
    }
    trip.price = (trip.schedule as any).price; // Ensure price is set from schedule

    res.json(trip);
  } catch (err: unknown) {
    console.error("Error fetching single trip:", err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// Create a new trip
router.post("/", async (req, res) => {
  try {
    const { bus, route, schedule, date, availableSeats, bookedSeats,price } = req.body;

    // Validate required fields
    if (!bus || !route || !schedule || !date) {
      return res.status(400).json({ 
        message: "Missing required fields: bus, route, schedule, date" 
      });
    }

    // Validate that references exist and are active
    const busDoc = await BusModel.findById(bus);
    if (!busDoc || busDoc.status !== 'active') {
      return res.status(400).json({ message: "Invalid or inactive bus" });
    }

    const routeDoc = await RouteModel.findById(route);
    if (!routeDoc) {
      return res.status(400).json({ message: "Invalid route" });
    }

    const scheduleDoc = await BusScheduleModel.findById(schedule);
    if (!scheduleDoc || scheduleDoc.status !== 'active') {
      return res.status(400).json({ message: "Invalid or inactive schedule" });
    }

    // Check if trip already exists for this date
    const existingTrip = await Trip.findOne({
      bus,
      route,
      schedule,
      price,
      date: new Date(date)
    });

    if (existingTrip) {
      return res.status(409).json({ message: "Trip already exists for this date" });
    }

    const trip = new Trip({
      bus,
      route,
      price,
      schedule,
      date: new Date(date),
      availableSeats: availableSeats || busDoc.seats,
      bookedSeats: bookedSeats || [],
    });

    const newTrip = await trip.save();
    
    const populatedTrip = await Trip.findById(newTrip._id)
      .populate('bus')
      .populate('route')
      .populate('schedule');
      
    res.status(201).json(populatedTrip);
  } catch (err: unknown) {
    console.error("Error creating trip:", err);
    if (err instanceof Error) {
      res.status(400).json({ 
        message: "Failed to create trip",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Bad request'
      });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

// Update trip (for seat booking, etc.)
router.patch("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update only allowed fields
    const allowedUpdates = ['availableSeats', 'bookedSeats',"price"];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {} as any);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid update fields provided" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('bus')
      .populate('route')
      .populate('schedule');

    res.json(updatedTrip);
  } catch (err: unknown) {
    console.error("Error updating trip:", err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

// Delete trip
router.delete("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if trip has bookings
    if (trip.bookedSeats.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete trip with existing bookings" 
      });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted successfully" });
  } catch (err: unknown) {
    console.error("Error deleting trip:", err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// Book seats on a trip
router.post("/:id/book", async (req, res) => {
  try {
    const { seatNumbers, customerId, customerName } = req.body;
    
    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "Invalid seat numbers" });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if seats are already booked
    const alreadyBooked = seatNumbers.filter(seat => trip.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ 
        message: `Seats already booked: ${alreadyBooked.join(', ')}` 
      });
    }

    // Check if enough seats are available
    if (trip.availableSeats < seatNumbers.length) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Update trip
    trip.bookedSeats.push(...seatNumbers);
    trip.availableSeats -= seatNumbers.length;
    trip.updatedAt = new Date();

    await trip.save();

    const populatedTrip = await Trip.findById(trip._id)
      .populate('bus')
      .populate('route')
      .populate('schedule');

    res.json({
      message: "Seats booked successfully",
      trip: populatedTrip,
      bookedSeats: seatNumbers
    });
  } catch (err: unknown) {
    console.error("Error booking seats:", err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;