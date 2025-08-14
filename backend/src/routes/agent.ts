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
      status: { $in: ['scheduled', 'started'] }
    })
    .populate('bus')
    .populate('route');

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

export default router;