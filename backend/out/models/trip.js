"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
// models/trip.ts
const mongoose_1 = require("mongoose");
const tripSchema = new mongoose_1.Schema({
    bus: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bus", required: true },
    price: { type: Number, min: 0 }, // Price per seat
    route: { type: mongoose_1.Schema.Types.ObjectId, ref: "Route", required: true },
    schedule: { type: mongoose_1.Schema.Types.ObjectId, ref: "BusSchedule", required: true },
    date: { type: Date, required: true },
    pickupPoints: { type: [String], default: [] },
    dropPoints: { type: [String], default: [] },
    availableSeats: { type: Number, required: true, min: 0 },
    bookedSeats: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
// Index for better query performance
tripSchema.index({ date: 1, route: 1 });
tripSchema.index({ date: 1, bus: 1 });
// Middleware to update the updatedAt field
tripSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.Trip = (0, mongoose_1.model)("Trip", tripSchema);
//# sourceMappingURL=trip.js.map