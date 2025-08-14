"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bus_1 = require("../models/bus");
const auth_1 = require("../models/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '..', '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Multer storage for image uploads
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname) || '.jpg';
        cb(null, `bus-${unique}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Get all buses
router.get('/', async (req, res) => {
    const buses = await bus_1.BusModel.find();
    res.json(buses);
});
// Get a single bus by ID
router.get('/:id', async (req, res) => {
    const bus = await bus_1.BusModel.findById(req.params.id);
    if (!bus)
        return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
});
// Create a new bus and a corresponding agent user
router.post('/', upload.single('image'), async (req, res) => {
    const { model, registrationNumber, type, seats, amenities, status, seatLayout, agentPassword } = req.body;
    if (!model || !registrationNumber || !type || !agentPassword) {
        return res.status(400).json({ error: 'model, registrationNumber, type, and agentPassword are required' });
    }
    let finalSeats = seats ? Number(seats) : 0;
    let finalSeatLayout = undefined;
    if (seatLayout) {
        try {
            finalSeatLayout = JSON.parse(seatLayout);
            if (finalSeatLayout && finalSeatLayout.totalSeats) {
                finalSeats = finalSeatLayout.totalSeats;
            }
        }
        catch (e) {
            console.error("Failed to parse seatLayout JSON:", e);
            return res.status(400).json({ error: 'Invalid seatLayout format' });
        }
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const file = req.file;
    const image = file ? `${baseUrl}/uploads/${file.filename}` : undefined;
    const amenitiesArray = Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string' && amenities.length
            ? amenities.split(',').map((a) => a.trim())
            : [];
    const bus = new bus_1.BusModel({
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
    const auth = new auth_1.AuthModel({
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
    const { model, registrationNumber, type, seats, amenities, status, seatLayout } = req.body;
    const update = { model, registrationNumber, type, status, updatedAt: new Date() };
    if (typeof seats !== 'undefined')
        update.seats = Number(seats);
    if (seatLayout) {
        try {
            const parsedSeatLayout = JSON.parse(seatLayout);
            update.seatLayout = parsedSeatLayout;
            if (parsedSeatLayout && parsedSeatLayout.totalSeats) {
                update.seats = parsedSeatLayout.totalSeats;
            }
        }
        catch (e) {
            console.error("Failed to parse seatLayout JSON:", e);
            return res.status(400).json({ error: 'Invalid seatLayout format' });
        }
    }
    if (typeof amenities !== 'undefined') {
        update.amenities = Array.isArray(amenities)
            ? amenities
            : typeof amenities === 'string' && amenities.length
                ? amenities.split(',').map((a) => a.trim())
                : [];
    }
    const file = req.file;
    if (file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        update.image = `${baseUrl}/uploads/${file.filename}`;
    }
    const bus = await bus_1.BusModel.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!bus)
        return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
});
// Delete a bus
router.delete('/:id', async (req, res) => {
    const bus = await bus_1.BusModel.findByIdAndDelete(req.params.id);
    if (!bus)
        return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
});
exports.default = router;
//# sourceMappingURL=buses.js.map