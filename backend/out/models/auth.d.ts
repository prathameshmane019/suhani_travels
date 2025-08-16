import { Document, Types } from 'mongoose';
export interface IAuthDocument extends Document {
    name?: string;
    phone?: string;
    registrationNumber?: string;
    password?: string;
    userId?: Types.ObjectId;
    role: 'passenger' | 'admin' | 'agent';
    busId?: Types.ObjectId;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}
export declare const AuthModel: import("mongoose").Model<IAuthDocument, {}, {}, {}, Document<unknown, {}, IAuthDocument, {}, {}> & IAuthDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=auth.d.ts.map