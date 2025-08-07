
export type BusType = 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
export type BusStatus = 'active' | 'inactive' | 'maintenance';

export interface BusFormData {
  name: string;
  type: BusType;
  totalSeats: number;
  amenities: string[];
  price: number;
  image: File | null;
  status: BusStatus;
}

export interface BusFilters {
  search: string;
  type: string;
  status: string;
}

// Base types
interface Route {
  id: string;
  from: string;
  to: string;
  buses: Bus[];
  distance?: string;
  status?: 'active' | 'inactive';
}

interface Bus {
  id: string;
  name: string;
  type: BusType;
  totalSeats: number;
  amenities: string[];
  price: number;
  image?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  rating?: number;
  availableSeats?: number;
  status: BusStatus;
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

// Sample data
const routes: Route[] = [
  {
    id: '1',
    from: 'Pandharpur',
    to: 'Pune',
    distance: '220 km',
    status: 'active',
    buses: [
      {
        id: 'b1',
        name: 'Shivneri Express',
        type: 'ac-sleeper',
        departureTime: '08:00',
        arrivalTime: '12:30',
        duration: '4h 30m',
        price: 450,
        rating: 4.5,
        amenities: ['AC', 'WiFi', 'Charging Point', 'Water'],
        availableSeats: 15,
        totalSeats: 40,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'b2',
        name: 'Maharashtra Travels',
        type: 'non-ac-seater',
        departureTime: '14:00',
        arrivalTime: '18:00',
        duration: '4h 00m',
        price: 250,
        rating: 4.2,
        amenities: ['Charging Point', 'Water'],
        availableSeats: 8,
        totalSeats: 45,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export type {
  Route,
  Bus,
  Seat,
  Booking,
  RefundRequest,
  SupportTicket,
  TicketMessage,
  Revenue,
  AdminUser
};