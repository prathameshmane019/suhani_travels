// Bus Types
export type BusType = 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
export type BusStatus = 'active' | 'inactive' | 'maintenance';

import mongoose, { Schema, Document, model } from 'mongoose';

// export interface BusDocument {
//   model: string;
//   registrationNumber: string; // fixed bus number/registration
//   type: BusType;
//   seats: number;
//   amenities: string[];
//   image?: string;
//   status: BusStatus;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const BusSchema = new Schema<BusDocument>({
//   model: { type: String, required: true },
//   registrationNumber: { type: String, required: true, unique: true },
//   type: { type: String, required: true, enum: ['ac-sleeper', 'non-ac-sleeper', 'ac-seater', 'non-ac-seater'] },
//   seats: { type: Number, required: true, min: 1 },
//   amenities: { type: [String], default: [] },
//   image: { type: String },
//   status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// export const BusModel = model<BusDocument>('Bus', BusSchema);

export interface SeatPosition {
  id: string;
  row: number;
  column: number;
  type: 'regular' | 'premium' | 'disabled' | 'empty';
  label: string;
}

export interface SeatLayout {
  id: string;
  name: string;
  rows: number;
  columns: number;
  seats: SeatPosition[];
  totalSeats: number;
}

export interface Seat {
  id: string;
  number: string;
  isBooked: boolean;
  isSelected: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  routeId: string;
  busId: string;
  seats: Seat[];
  travelDate: string;
  amount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface RefundRequestDocument extends Document {
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const RefundRequestSchema = new Schema<RefundRequestDocument>({
  bookingId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  requestDate: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

export const RefundRequestModel = model<RefundRequestDocument>('RefundRequest', RefundRequestSchema);

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'admin';
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: TicketMessage[];
}

export interface Revenue {
  total: number;
  bookings: number;
  averageBookingValue: number;
  monthlyGrowth: number;
  periodStart: string;
  periodEnd: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support';
  permissions: string[];
} 
export interface SupportTicketDocument extends Document {
  customerId: string;
  customerName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: any[];
}

const SupportTicketSchema = new Schema<SupportTicketDocument>({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  subject: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  messages: { type: [Object], default: [] },
});

export const SupportTicketModel = model<SupportTicketDocument>('SupportTicket', SupportTicketSchema);

export interface AdminUserDocument extends Document {
  name: string;
  email: string;
  role: 'admin' | 'support';
  permissions: string[];
}

const AdminUserSchema = new Schema<AdminUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['admin', 'support'], default: 'admin' },
  permissions: { type: [String], default: [] },
});

export const AdminUserModel = model<AdminUserDocument>('AdminUser', AdminUserSchema);
