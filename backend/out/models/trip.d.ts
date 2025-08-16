import { Document, Schema } from "mongoose";
export interface ITripDocument extends Document {
    bus: Schema.Types.ObjectId;
    route: Schema.Types.ObjectId;
    schedule: Schema.Types.ObjectId;
    price: number;
    date: Date;
    availableSeats: number;
    bookedSeats: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Trip: import("mongoose").Model<ITripDocument, {}, {}, {}, Document<unknown, {}, ITripDocument, {}, {}> & ITripDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=trip.d.ts.map