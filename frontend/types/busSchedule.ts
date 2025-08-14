import { IPopulatedBus } from ".";
import { IRoute } from "./route";

 

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

 

export interface BusSchedule {
  _id: string;
  busId: string | IPopulatedBus;
  routeId: string | IRoute;
  startTime: string;
  endTime: string ;
  operatingDays: DayOfWeek[];
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface StopTiming {
  stopId: string;
  arrivalTime: string;
  departureTime: string;
}

export interface BusScheduleFormData {
  busId: string;
  routeId: string;
  operatingDays: DayOfWeek[];
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
  startTime: string; // Overall schedule start time
  endTime: string;   // Overall schedule end time
  stopTimings: StopTiming[];
}
