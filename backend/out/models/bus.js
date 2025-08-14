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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusScheduleModel = exports.RouteModel = exports.BusModel = void 0;
// Enhanced schemas with all required fields
const mongoose_1 = __importStar(require("mongoose"));
const BusSchema = new mongoose_1.Schema({
    busModel: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    type: {
        type: String,
        required: true,
        enum: ['ac-sleeper', 'non-ac-sleeper', 'ac-seater', 'non-ac-seater']
    },
    seats: { type: Number, required: true, min: 1 },
    amenities: { type: [String], default: [] },
    image: { type: String },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    rating: { type: Number, default: 4.0, min: 1, max: 5 },
    seatLayout: {
        type: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            rows: { type: Number, required: true },
            columns: { type: Number, required: true },
            seats: { type: Array, required: true },
            totalSeats: { type: Number, required: true },
        },
        required: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.BusModel = mongoose_1.default.model('Bus', BusSchema);
const RouteSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    stops: [
        {
            name: { type: String, required: true },
            sequence: { type: Number, required: true, min: 1 },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.RouteModel = mongoose_1.default.model('Route', RouteSchema);
const BusScheduleSchema = new mongoose_1.Schema({
    busId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Bus', required: true },
    price: { type: Number, required: true, min: 0 },
    routeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Route', required: true },
    operatingDays: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            required: true
        }],
    startTime: { type: String, required: true }, // Format: "HH:MM"
    endTime: { type: String, required: true }, // Format: "HH:MM"
    stopTimings: [
        {
            stopId: { type: String, required: true },
            arrivalTime: { type: String, required: true },
            departureTime: { type: String, required: true },
        },
    ],
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.BusScheduleModel = mongoose_1.default.model('BusSchedule', BusScheduleSchema);
//# sourceMappingURL=bus.js.map