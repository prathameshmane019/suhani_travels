export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Base stop without timing information
export interface RouteStop {
  id: string;
  name: string;
  sequence: number;
  distanceFromLast: number; // Distance from previous stop in km
  expectedDuration: number; // Expected duration to next stop in minutes
}

// Route represents a fixed path with stops
export interface RouteData {
  id: string;
  name: string;
  stops: RouteStop[];
  totalDistance: number;
  status: 'active' | 'inactive';
  description?: string;
}

export interface RouteFormData {
  name: string;
  stops: Omit<RouteStop, 'id'>[];
  totalDistance: number;
  status: 'active' | 'inactive';
  description?: string;
}

// Stop timing information for a scheduled ride
export interface StopTiming {
  stopId: string;
  arrivalTime: string | null;
  departureTime: string | null;
  platformNumber?: string;
}

// Schedule represents recurring ride timings
export interface Schedule extends ScheduleFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormData {
  routeId: string;
  vehicleId: string;
  operatingDays: DayOfWeek[];
  stopTimings: Omit<StopTiming, 'id'>[];
  fare: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'active' | 'inactive';
}

// Ride represents a single instance of a schedule
export interface RideData {
  id: string;
  scheduleId: string;
  date: string; // YYYY-MM-DD
  stopTimings: StopTiming[];
  status: 'scheduled' | 'delayed' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  availableSeats: number;
  delay?: number; // Delay in minutes if any
}
