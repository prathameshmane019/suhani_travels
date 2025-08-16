"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importStar(require("../middleware/auth"));
const trip_1 = require("../models/trip");
const booking_1 = require("../models/booking");
const router = express_1.default.Router();
// Get ongoing trips for the authenticated agent's bus
router.get('/ongoing-trips/:busId', auth_1.default, (0, auth_1.authorizeRoles)('agent'), async (req, res) => {
    try {
        const { busId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ongoingTrips = await trip_1.Trip.find({
            bus: busId,
            date: { $gte: today },
        })
            .populate('bus')
            .populate('route');
        console.log("Ongoing trips:", ongoingTrips);
        res.json(ongoingTrips);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get bookings for a specific trip of the authenticated agent's bus
router.get('/trip-bookings/:tripId', auth_1.default, (0, auth_1.authorizeRoles)('agent'), async (req, res) => {
    try {
        const { tripId } = req.params;
        const bookings = await booking_1.Booking.find({ tripId })
            .populate('userId');
        res.json(bookings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create a new booking for an agent
router.post('/bookings', auth_1.default, (0, auth_1.authorizeRoles)('agent'), async (req, res) => {
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
        const trip = await trip_1.Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found.' });
        }
        // Assuming trip.bookedSeats is an array of strings (seat numbers)
        const unavailableSeats = seatNumbers.filter((seat) => trip.bookedSeats.includes(seat));
        if (unavailableSeats.length > 0) {
            return res.status(400).json({ message: `Seats ${unavailableSeats.join(', ')} are already booked.` });
        }
        // Update booked seats in the Trip model
        trip.bookedSeats.push(...seatNumbers);
        trip.availableSeats = trip.availableSeats - trip.bookedSeats.length;
        await trip.save();
        const newBooking = new booking_1.Booking({
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
            paymentStatus: 'completed', // Cash payments are pending until collected
        });
        await newBooking.save();
        res.status(201).json(newBooking);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
});
exports.default = router;
//# sourceMappingURL=agent.js.map