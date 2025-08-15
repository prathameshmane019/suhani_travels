import express from 'express';
import auth, { authorizeRoles } from '../middleware/auth';
import { Trip } from '../models/trip';
import { Booking } from '../models/booking';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Get ongoing trips for the authenticated agent's bus
router.get('/ongoing-trips/:busId', auth, authorizeRoles('agent'), async (req: AuthRequest, res: Response) => {
  try {
    const { busId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ongoingTrips = await Trip.find({
      bus: busId,
      date: { $gte: today },
       
    })
    .populate('bus')
    .populate('route');

    console.log("Ongoing trips:", ongoingTrips);
    res.json(ongoingTrips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for a specific trip of the authenticated agent's bus
router.get('/trip-bookings/:tripId', auth, authorizeRoles('agent'), async (req: AuthRequest, res: Response) => {
  try {
    const { tripId } = req.params;

    const bookings = await Booking.find({ tripId })
      .populate('userId');

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new booking for an agent
router.post('/bookings', auth, authorizeRoles('agent'), async (req: AuthRequest, res: Response) => {
  try {
    const { tripId, seatNumbers, passengerDetails, totalPrice, paymentMethod, transactionId, notes, boardingPoint, dropoffPoint } = req.body;

    console.log(req.body);
    // Basic validation
    if (!tripId || !seatNumbers || seatNumbers.length === 0 || !passengerDetails || passengerDetails.length === 0 || !totalPrice || !paymentMethod || !boardingPoint || !dropoffPoint) {
      return res.status(400).json({ message: 'Missing required booking fields.' });
    }

    // Ensure passenger details count matches seat numbers count
    if (seatNumbers.length !== passengerDetails.length) {
      return res.status(400).json({ message: 'Number of passenger details must match number of seat numbers.' });
    }

    // Check if seats are available for the given trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Assuming trip.bookedSeats is an array of strings (seat numbers)
    const unavailableSeats = seatNumbers.filter((seat: string) => trip.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: `Seats ${unavailableSeats.join(', ')} are already booked.` });
    }

    // Update booked seats in the Trip model
    trip.bookedSeats.push(...seatNumbers);
    trip.availableSeats = trip.availableSeats - trip.bookedSeats.length;
    await trip.save();

    const newBooking = new Booking({
      tripId,
      userId: req.user?._id, // Associate with the agent's user ID if available
      seatNumbers,
      passengerDetails,
      totalPrice,
      paymentMethod,
      transactionId,
      notes,
      boardingPoint,
      dropoffPoint,
      status: 'confirmed', // Agent bookings are typically confirmed immediately
      paymentStatus:  'completed', // Cash payments are pending until collected
    });

    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error while creating booking.' });
  }
});

export default router;