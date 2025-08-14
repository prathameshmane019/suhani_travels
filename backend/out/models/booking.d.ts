import { Document, Schema } from "mongoose";
export interface IPassengerDetails {
    name: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
}
export interface IBookingDocument extends Document {
    tripId: Schema.Types.ObjectId;
    userId?: Schema.Types.ObjectId;
    seatNumbers: string[];
    passengerDetails: IPassengerDetails[];
    totalPrice: number;
    bookingDate: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod?: string;
    transactionId?: string;
    notes?: string;
    boardingPoint: {
        name: string;
        sequence: number;
    };
    dropoffPoint: {
        name: string;
        sequence: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Booking: import("mongoose").Model<IBookingDocument, {}, {}, {}, Document<unknown, {}, IBookingDocument, {}, {}> & IBookingDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=booking.d.ts.map