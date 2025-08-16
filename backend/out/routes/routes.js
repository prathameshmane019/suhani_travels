"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bus_1 = require("../models/bus"); // Adjust import path as needed
const router = express_1.default.Router();
// Get all routes
router.get('/', async (req, res) => {
    const routes = await bus_1.RouteModel.find();
    res.json(routes);
});
// Get a single route by ID
router.get('/:id', async (req, res) => {
    const route = await bus_1.RouteModel.findById(req.params.id);
    if (!route)
        return res.status(404).json({ error: 'Route not found' });
    res.json(route);
});
// Create a new route (fixed entity: name + ordered stops, including start and end)
router.post('/', async (req, res) => {
    const { name, stops, basePrice, distance } = req.body;
    console.log(req.body);
    if (!name || !Array.isArray(stops) || stops.length < 2 || distance === undefined) {
        return res.status(400).json({ error: 'Route requires name, at least two stops (start and end), basePrice, and distance.' });
    }
    const normalizedStops = stops.map((s, index) => ({ name: s.name, sequence: s.sequence ?? index + 1 }));
    const route = new bus_1.RouteModel({ name, stops: normalizedStops, basePrice, distance });
    await route.save();
    res.status(201).json(route);
});
// Update a route
router.put('/:id', async (req, res) => {
    const { name, stops, basePrice, distance } = req.body;
    const updated = await bus_1.RouteModel.findByIdAndUpdate(req.params.id, { name, stops: Array.isArray(stops) ? stops.map((s, i) => ({ name: s.name, sequence: s.sequence ?? i + 1 })) : undefined, basePrice, distance, updatedAt: new Date() }, { new: true });
    if (!updated)
        return res.status(404).json({ error: 'Route not found' });
    res.json(updated);
});
// Delete a route
router.delete('/:id', async (req, res) => {
    const route = await bus_1.RouteModel.findByIdAndDelete(req.params.id);
    if (!route)
        return res.status(404).json({ error: 'Route not found' });
    res.json(route);
});
exports.default = router;
//# sourceMappingURL=routes.js.map