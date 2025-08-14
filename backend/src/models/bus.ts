// Enhanced schemas with all required fields
import mongoose, { model, Schema } from 'mongoose';
import { SeatLayout } from '../types';

// Bus Schema
export interface IBusDocument extends Document {
  model: string;
  registrationNumber: string;
  type: 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
  seats: number;
  amenities: string[];
  image?: string;
  status: 'active' | 'inactive' | 'maintenance';
  rating: number;
  seatLayout?: SeatLayout;
  createdAt: Date;
  updatedAt: Date;
}

const BusSchema = new Schema<IBusDocument>({
  model: { type: String, required: true },
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

export const BusModel = model<IBusDocument>('Bus', BusSchema);

// Route Schema
export interface IRouteDocument extends Document {
  name: string;
  stops: { _id?: string; name: string; sequence: number }[];
  basePrice: number;
  distance: number;
  createdAt: Date;
  updatedAt: Date;
}

const RouteSchema = new Schema<IRouteDocument>({
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

export const RouteModel = model<IRouteDocument>('Route', RouteSchema);

// Bus Schedule Schema
export interface IBusScheduleDocument extends Document {
  busId: mongoose.Schema.Types.ObjectId;
  routeId: mongoose.Schema.Types.ObjectId;
  operatingDays: string[];
  price: number;
  startTime: string; // Overall schedule start time
  endTime: string;   // Overall schedule end time
  stopTimings: {
    stopId: mongoose.Schema.Types.ObjectId;
    arrivalTime: string;
    departureTime: string;
  }[];
  status: 'active' | 'inactive' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BusScheduleSchema = new Schema<IBusScheduleDocument>({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  price: { type: Number, required: true, min: 0 },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  operatingDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  }],
  startTime: { type: String, required: true }, // Format: "HH:MM"
  endTime: { type: String, required: true },   // Format: "HH:MM"
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

export const BusScheduleModel = model<IBusScheduleDocument>('BusSchedule', BusScheduleSchema);