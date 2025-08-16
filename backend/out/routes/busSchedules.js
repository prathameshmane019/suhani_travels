"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bus_1 = require("../models/bus"); // Adjust import path as needed
const router = express_1.default.Router();
// Get all bus schedules
router.get('/', async (req, res) => {
    const schedules = await bus_1.BusScheduleModel.find()
        .populate('busId')
        .populate('routeId');
    res.json(schedules);
});
// Get a single bus schedule by ID
router.get('/:id', async (req, res) => {
    const schedule = await bus_1.BusScheduleModel.findById(req.params.id)
        .populate('busId')
        .populate('routeId');
    if (!schedule)
        return res.status(404).json({ error: 'Bus schedule not found' });
    res.json(schedule);
});
// Create a new bus schedule
router.post('/', async (req, res) => {
    const { busId, routeId, operatingDays, status, price, startTime, endTime, stopTimings } = req.body;
    if (!busId || !routeId || !Array.isArray(operatingDays) || operatingDays.length === 0 || !startTime || !endTime || !Array.isArray(stopTimings)) {
        return res.status(400).json({ error: 'busId, routeId, operatingDays, startTime, endTime, and stopTimings are required' });
    }
    const busSchedule = new bus_1.BusScheduleModel({ busId, routeId, operatingDays, status, price, startTime, endTime, stopTimings });
    await busSchedule.save();
    res.status(201).json(busSchedule);
});
// Update a bus schedule
router.put('/:id', async (req, res) => {
    const { busId, routeId, operatingDays, status, price, startTime, endTime, stopTimings } = req.body;
    const busSchedule = await bus_1.BusScheduleModel.findByIdAndUpdate(req.params.id, { busId, routeId, operatingDays, status, price, startTime, endTime, stopTimings, updatedAt: new Date() }, { new: true });
    if (!busSchedule)
        return res.status(404).json({ error: 'Bus schedule not found' });
    res.json(busSchedule);
});
// Delete a bus schedule
router.delete('/:id', async (req, res) => {
    const busSchedule = await bus_1.BusScheduleModel.findByIdAndDelete(req.params.id);
    if (!busSchedule)
        return res.status(404).json({ error: 'Bus schedule not found' });
    res.json(busSchedule);
});
exports.default = router;
//# sourceMappingURL=busSchedules.js.map