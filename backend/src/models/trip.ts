// models/trip.ts
import { Document, Schema, model } from "mongoose";

export interface ITripDocument extends Document {
  bus: Schema.Types.ObjectId;
  route: Schema.Types.ObjectId;
  schedule: Schema.Types.ObjectId;
  price:number;
  date: Date;
  pickupPoints: string[];
  dropPoints: string[];
  availableSeats: number;
  bookedSeats: string[];
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITripDocument>({
  bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
  price:{type:Number ,min:0}, // Price per seat
  route: { type: Schema.Types.ObjectId, ref: "Route", required: true },
  schedule: { type: Schema.Types.ObjectId, ref: "BusSchedule", required: true },
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

export const Trip = model<ITripDocument>("Trip", tripSchema);
