
import { IPopulatedBus, IPopulatedRoute, IPopulatedSchedule } from ".";

// Main Trip interface for frontend
export interface ITrip {
  _id: string;
  bus: IPopulatedBus;
  price: number; // Price per seat
  route: IPopulatedRoute;
  schedule: IPopulatedSchedule;
  date: Date;
  availableSeats: number;
  bookedSeats: string[];
  createdAt?: Date;
  updatedAt?: Date;
}