export type BusType = 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
export type BusStatus = 'active' | 'inactive' | 'maintenance';
import mongoose, { Document } from 'mongoose';
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
export declare const RefundRequestModel: mongoose.Model<RefundRequestDocument, {}, {}, {}, mongoose.Document<unknown, {}, RefundRequestDocument, {}, {}> & RefundRequestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
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
export declare const SupportTicketModel: mongoose.Model<SupportTicketDocument, {}, {}, {}, mongoose.Document<unknown, {}, SupportTicketDocument, {}, {}> & SupportTicketDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface AdminUserDocument extends Document {
    name: string;
    email: string;
    role: 'admin' | 'support';
    permissions: string[];
}
export declare const AdminUserModel: mongoose.Model<AdminUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, AdminUserDocument, {}, {}> & AdminUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=types.d.ts.map