
import { ITrip } from "./trip";
import { IUser } from "./user";

export interface IPassengerDetails {
  name: string;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
}

export interface IBooking {
  _id: string;
  tripId: string | ITrip;
  userId?: string | IUser;
  seatNumbers: string[];
  passengerDetails: IPassengerDetails[];
  totalPrice: number;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  bookingReference: string;
  totalPassengers: number;
}
