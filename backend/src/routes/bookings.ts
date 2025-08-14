import express, { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { Trip } from '../models/trip';
import mongoose from 'mongoose'; 
const PDFDocument = require('pdfkit');

const router = express.Router();
 
interface IBookingTicket {
  _id: string;
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  travelDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  seats: string[];
  passenger: {
    name: string;
    phone: string;
    email?: string;
  };
  bus: {
    registrationNumber: string;
    model: string;
    type: string; 
  };
  route: {
    from: string;
    to: string;
    duration: string;
  };
  schedule: {
    endTime: string;
    startTime: string;
  };
  tripId: {
    _id: string;
    date: string;
  };
}
// Interface for the booking payload from frontend
interface IBookingPayload {
  tripId: string;
  userId?: string;
  seatNumbers: string[];
  passengerDetails: Array<{
    name: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
  }>;
  totalPrice: number;
  boardingPoint: { name: string; sequence: number; }; // Add to payload
  dropoffPoint: { name: string; sequence: number; };   // Add to payload
}

// Helper function to get booked seats for a trip
const getBookedSeats = async (tripId: string): Promise<string[]> => {
  try {
    const bookings = await Booking.find({ tripId, status: 'confirmed' }).select('seatNumbers');
    return bookings.flatMap(booking => booking.seatNumbers);
  } catch (error) {
    console.error('Error getting booked seats:', error);
    return [];
  }
};

// Get all bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    let query: any = {};
    // If user is authenticated, filter by their ID
    if ((req as any).user && (req as any).user.role === 'user') {
      query.userId = (req as any).user.id;
    }

    const bookings = await Booking.find(query)
     .populate({
          path: 'tripId',
          select: 'route bus date price schedule',
          populate: [
            {
              path: 'route',
              select: 'from to duration'
            },
            {
              path: 'schedule',
              select: 'startTime endTime duration schedule'
            },
            {
              path: 'bus',
              select: 'registrationNumber model type'
            }
          ]
        })
        .sort({ createdAt: -1 })
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get bookings by mobile number
router.get('/by-mobile', async (req: Request, res: Response) => {
  try {
    const { mobile, page = 1, limit = 10 } = req.query;

    if (!mobile || typeof mobile !== 'string' || !/^\d{10,}$/.test(mobile)) {
      return res.status(400).json({ message: 'Valid mobile number is required' });
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [bookings, total] = await Promise.all([
      Booking.find({ 'passengerDetails.phone': mobile })
        .populate({
          path: 'tripId',
          select: 'route bus date price schedule',
          populate: [
            {
              path: 'route',
              select: 'from to duration'
            },
            {
              path: 'schedule',
              select: 'startTime endTime duration schedule'
            },
            {
              path: 'bus',
              select: 'registrationNumber model type'
            }
          ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments({ 'passengerDetails.phone': mobile })
    ]);

    res.json({
      bookings,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      totalBookings: total
    });
  } catch (error) {
    console.error('Error fetching bookings by mobile:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});
 
// Get a single booking by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(id)
      .populate({
          path: 'tripId',
          select: 'route bus date price schedule',
          populate: [
            {
              path: 'route',
              select: 'from to duration'
            },
            {
              path: 'schedule',
              select: 'startTime endTime duration schedule'
            },
            {
              path: 'bus',
              select: 'registrationNumber model type'
            }
          ]
        });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    console.log(booking);
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});


// Create a new booking - Main booking endpoint with MongoDB transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const { tripId, userId, seatNumbers, passengerDetails, totalPrice, boardingPoint, dropoffPoint }: IBookingPayload = req.body;
    console.log(req.body);

    // Validation
    if (!tripId || !seatNumbers || seatNumbers.length === 0 || !passengerDetails || passengerDetails.length === 0 || !boardingPoint || !dropoffPoint) {
      return res.status(400).json({ 
        message: 'Missing required fields: tripId, seatNumbers, passengerDetails, boardingPoint, and dropoffPoint are required' 
      });
    }

    // Validate tripId format
    if (!tripId || !mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    // Validate that we have passenger details for each seat
    if (seatNumbers.length !== passengerDetails.length) {
      return res.status(400).json({ 
        message: 'Number of passengers must match number of selected seats' 
      });
    }

    // Validate passenger details
    for (const passenger of passengerDetails) {
      if (!passenger.name?.trim() || !passenger.gender) {
        return res.status(400).json({ 
          message: 'All passengers must have name and gender filled' 
        });
      }

      // Email validation if provided
      if (passenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger?.email?.trim())) {
        return res.status(400).json({ 
          message: 'Please provide valid email addresses' 
        });
      }
    }

    let newBooking;

    // Check if trip exists and populate route to validate boarding/dropoff points
    const trip = await Trip.findById(tripId).populate('bus').populate('route');
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Validate boarding and dropoff points against the trip's route stops
    const routeStops = (trip.route as any).stops;
    const foundBoardingPoint = routeStops.find((s: any) => s.name === boardingPoint.name);
    const foundDropoffPoint = routeStops.find((s: any) => s.name === dropoffPoint.name);

    if (!foundBoardingPoint || !foundDropoffPoint) {
      return res.status(400).json({ message: 'Invalid boarding or dropoff point provided' });
    }

    if (foundBoardingPoint.sequence >= foundDropoffPoint.sequence) {
      return res.status(400).json({ message: 'Dropoff point must be after boarding point' });
    }

    // Check if trip date is in the future
    const tripDate = new Date(trip.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tripDate < today) {
      throw new Error('Cannot book seats for past trips');
    }

    // Check seat availability using current booked seats from trip
    const currentBookedSeats = trip.bookedSeats || [];
    const conflictingSeats = seatNumbers.filter(seat => currentBookedSeats.includes(seat));
    
    if (conflictingSeats.length > 0) {
      throw new Error(`The following seats are no longer available: ${conflictingSeats.join(', ')}. Please select different seats.`);
    }

    // Validate seat numbers are within bus capacity
    const maxSeat = Math.max(...seatNumbers.map(Number));
    if (maxSeat > (trip?.bus as any)?.seats) {
      throw new Error(`Invalid seat number. Maximum seat number is ${(trip?.bus as any)?.seats}`);
    }

    // Validate total price
    const calculatedPrice = seatNumbers.length * trip.price;
    if (Math.abs(totalPrice - calculatedPrice) > 0.01) {
      throw new Error(`Price mismatch. Expected: ${calculatedPrice.toFixed(2)}, Received: ${totalPrice.toFixed(2)}`);
    }

    // Create the booking
    newBooking = new Booking({
      tripId,
      userId: userId || undefined,
      seatNumbers,
      passengerDetails: passengerDetails.map(p => ({
        name: p.name.trim(),
        gender: p.gender,
        phone: p.phone?.trim(),
        email: p.email?.trim() || undefined,
      })),
      totalPrice,
      status: 'confirmed',
      bookingDate: new Date(),
      boardingPoint: { name: foundBoardingPoint.name, sequence: foundBoardingPoint.sequence }, // Save validated boarding point
      dropoffPoint: { name: foundDropoffPoint.name, sequence: foundDropoffPoint.sequence },     // Save validated dropoff point
    });

    // Save booking
    await newBooking.save();

    // Update trip with booked seats
    await Trip.findByIdAndUpdate(
      tripId,
      {
        $addToSet: { bookedSeats: { $each: seatNumbers } },
        $inc: { availableSeats: -seatNumbers.length },
        updatedAt: new Date()
      },
      { new: true }
    );

    // Populate the booking details for the response
    const populatedBooking = await Booking.findById((newBooking as any) ._id)
      .populate('tripId', 'route bus date schedule price bookedSeats availableSeats');

    res.status(201).json({ 
      message: 'Booking created successfully!', 
      booking: populatedBooking 
    });

  } catch (error:any) {
    console.error('Error creating booking:', error);
    
    // Handle specific error messages
    if (error.message.includes('seats are no longer available')) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message === 'Trip not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Cannot book seats') || 
        error.message.includes('Price mismatch') || 
        error.message.includes('Invalid seat number')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error while creating booking' });
  }
});

// Update booking status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: pending, confirmed, or cancelled' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true }
    ).populate('tripId', 'route bus date schedule price');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated successfully', booking });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Cancel a booking
router.patch('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(id).populate('tripId', 'date');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Check if trip date allows cancellation (at least 24 hours before)
    const tripDate = new Date((booking.tripId as any).date);
    const now = new Date();
    const hoursDifference = (tripDate.getTime() - now.getTime()) / (1000 * 3600);

    if (hoursDifference < 24) {
      return res.status(400).json({ 
        message: 'Cannot cancel booking less than 24 hours before trip departure' 
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

// Delete a booking (admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully', booking });

  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

// Get booking statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Calculate total revenue from confirmed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('tripId', 'route bus date')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        pendingBookings,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      },
      recentBookings,
    });

  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({ message: 'Failed to fetch booking statistics' });
  }
});

// Check seat availability for a trip
router.get('/availability/:tripId', async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    if (!tripId || !mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    // Get the trip to know total seats
    const trip = await Trip.findById(tripId).populate('bus');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Get all booked seat numbers
    const bookedSeats = await getBookedSeats(tripId);

    res.json({
      tripId,
      totalSeats: (trip.bus as any)?.seats || 0,
      bookedSeats,
      availableSeats: ((trip.bus as any)?.seats || 0) - bookedSeats.length,
    });

  } catch (error) {
    console.error('Error checking seat availability:', error);
    res.status(500).json({ message: 'Failed to check seat availability' });
  }
});

export default router;