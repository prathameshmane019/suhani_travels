import mongoose, { Document } from 'mongoose';
import { SeatLayout } from '../types';
export interface IBusDocument extends Document {
    busModel: string;
    registrationNumber: string;
    type: 'ac-sleeper' | 'non-ac-sleeper' | 'ac-seater' | 'non-ac-seater';
    seats: number;
    amenities: string[];
    image?: string;
    imagePublicId?: string;
    status: 'active' | 'inactive' | 'maintenance';
    rating: number;
    seatLayout?: SeatLayout;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBusWithImageUrls extends IBusDocument {
    imageUrls?: {
        original?: string;
        thumbnail: string;
        medium: string;
        large: string;
    };
}
export declare const BusModel: mongoose.Model<IBusDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBusDocument, {}, {}> & IBusDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface IRouteDocument extends Document {
    name: string;
    stops: {
        _id?: string;
        name: string;
        sequence: number;
    }[];
    basePrice: number;
    distance: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RouteModel: mongoose.Model<IRouteDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRouteDocument, {}, {}> & IRouteDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface IBusScheduleDocument extends Document {
    busId: mongoose.Schema.Types.ObjectId;
    routeId: mongoose.Schema.Types.ObjectId;
    operatingDays: string[];
    price: number;
    startTime: string;
    endTime: string;
    stopTimings: {
        stopId: mongoose.Schema.Types.ObjectId;
        arrivalTime: string;
        departureTime: string;
    }[];
    status: 'active' | 'inactive' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
export declare const BusScheduleModel: mongoose.Model<IBusScheduleDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBusScheduleDocument, {}, {}> & IBusScheduleDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=bus.d.ts.map