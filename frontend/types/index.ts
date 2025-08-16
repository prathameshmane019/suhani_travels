
export type BusType = 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
export type BusStatus = 'active' | 'inactive' | 'maintenance';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';



// Frontend interfaces for populated data
export interface IPopulatedBus {
  _id: string;
  busModel: string;
  registrationNumber: string;
  type: BusType;
  seats: number;
  amenities: string[];
  image?: string;
  seatLayout: SeatLayout;
  status: BusStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedRoute {
  _id: string;
  name: string;
  stops: { _id?: string; name: string; sequence: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedSchedule {
  endTime: string;
  startTime: string;
  _id: string;
  busId: string;
  routeId: string;
  operatingDays: DayOfWeek[];
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: 'active' | 'inactive' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type { ITrip } from './trip';


export interface BusFormData { 
  type: BusType;
  seats: number;
  amenities: string[];
  image: File | null;
  status: BusStatus;
  seatLayout?:SeatLayout;
  agentPassword:string;
  registrationNumber: string;
  busModel: string;
}


export interface SeatPosition {
  id: string
  row: number
  column: number
  type: "regular" | "premium" | "disabled" | "empty"
  price?: number
  label?: string
  seatLayout?: SeatLayout
}

export interface SeatLayout {
  id: string
  name: string
  rows: number
  columns: number
  seats: SeatPosition[]
  totalSeats: number
}

export interface BookedSeat {
  seatId: string
  passengerName?: string
  bookingId?: string
}
export interface BusFilters {
  search: string;
  type: string;
  status: string;
}

export interface Route {
  id: string;
  name: string;
  stops: { id?: string; name: string; sequence: number }[]; 
  distance: number;
  createdAt: Date;
  updatedAt: Date;
}
interface Bus {
  id: string;
  registrationNumber: string;
  busModel: string;
  type: BusType;
  seats: number;
  amenities: string[];
  image?: string;
  status: BusStatus;
  seatLayout?:SeatLayout
  createdAt: Date;
  updatedAt: Date;
}

interface Seat {
  id: string;
  number: string;
  isBooked: boolean;
  isSelected: boolean;
  type: 'regular' | 'premium';
  price: number;
}

// Admin types
interface Booking {
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

interface RefundRequest {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: TicketMessage[];
}


interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'admin';
  message: string;
  createdAt: string;
}

interface Revenue {
  total: number;
  bookings: number;
  averageBookingValue: number;
  monthlyGrowth: number;
  periodStart: string;
  periodEnd: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support';
  permissions: string[];
}


export type {
  Bus,
  Seat, 
  Booking,
  RefundRequest,
  SupportTicket,
  TicketMessage,
  Revenue,
  AdminUser
};