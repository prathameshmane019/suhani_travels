import express from 'express';
import { BusModel } from '../models/bus';
import { AuthModel } from '../models/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { SeatLayout } from '../types';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (_req: express.Request, _file: any, cb: (error: any, destination: string) => void) => cb(null, uploadsDir),
  filename: (_req: express.Request, file: any, cb: (error: any, filename: string) => void) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `bus-${unique}${ext}`);
  },
});
const upload = multer({ storage });

// Get all buses
router.get('/', async (req, res) => {
  const buses = await BusModel.find();
  res.json(buses);
});

// Get a single bus by ID
router.get('/:id', async (req, res) => {
  const bus = await BusModel.findById(req.params.id);
  if (!bus) return res.status(404).json({ error: 'Bus not found' });
  res.json(bus);
});

// Create a new bus and a corresponding agent user
router.post('/', upload.single('image'), async (req, res) => {
  const { model, registrationNumber, type, seats, amenities, status, seatLayout, agentPassword } = req.body as any;

  if (!model || !registrationNumber || !type || !agentPassword) {
    return res.status(400).json({ error: 'model, registrationNumber, type, and agentPassword are required' });
  }

  let finalSeats = seats ? Number(seats) : 0;
  let finalSeatLayout: SeatLayout | undefined = undefined;

  if (seatLayout) {
    try {
      finalSeatLayout = JSON.parse(seatLayout);
      if (finalSeatLayout && finalSeatLayout.totalSeats) {
        finalSeats = finalSeatLayout.totalSeats;
      }
    } catch (e) {
      console.error("Failed to parse seatLayout JSON:", e);
      return res.status(400).json({ error: 'Invalid seatLayout format' });
    }
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const file = (req as any).file as { filename: string } | undefined;
  const image = file ? `${baseUrl}/uploads/${file.filename}` : undefined;
  const amenitiesArray = Array.isArray(amenities)
    ? amenities
    : typeof amenities === 'string' && amenities.length
      ? amenities.split(',').map((a: string) => a.trim())
      : [];

  const bus = new BusModel({
    model,
    registrationNumber,
    type,
    seats: finalSeats,
    amenities: amenitiesArray,
    status,
    ...(image ? { image } : {}),
    ...(finalSeatLayout ? { seatLayout: finalSeatLayout } : {}),
  });

  await bus.save();

  const auth = new AuthModel({
    name: `Agent for ${registrationNumber}`,
    registrationNumber,
    password: agentPassword,
    role: 'agent',
    busId: bus._id,
  });

  await auth.save();

  res.status(201).json({ bus, auth });
});

// Update a bus
router.put('/:id', upload.single('image'), async (req, res) => {
  const { model, registrationNumber, type, seats, amenities, status, seatLayout } = req.body as any;
  const update: any = { model, registrationNumber, type, status, updatedAt: new Date() };

  if (typeof seats !== 'undefined') update.seats = Number(seats);

  if (seatLayout) {
    try {
      const parsedSeatLayout: SeatLayout = JSON.parse(seatLayout);
      update.seatLayout = parsedSeatLayout;
      if (parsedSeatLayout && parsedSeatLayout.totalSeats) {
        update.seats = parsedSeatLayout.totalSeats;
      }
    } catch (e) {
      console.error("Failed to parse seatLayout JSON:", e);
      return res.status(400).json({ error: 'Invalid seatLayout format' });
    }
  }

  if (typeof amenities !== 'undefined') {
    update.amenities = Array.isArray(amenities)
      ? amenities
      : typeof amenities === 'string' && amenities.length
        ? amenities.split(',').map((a: string) => a.trim())
        : [];
  }
  const file = (req as any).file as { filename: string } | undefined;
  if (file) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    update.image = `${baseUrl}/uploads/${file.filename}`;
  }
  const bus = await BusModel.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!bus) return res.status(404).json({ error: 'Bus not found' });
  res.json(bus);
});

// Delete a bus
router.delete('/:id', async (req, res) => {
  const bus = await BusModel.findByIdAndDelete(req.params.id);
  if (!bus) return res.status(404).json({ error: 'Bus not found' });
  res.json(bus);
});

export default router;
