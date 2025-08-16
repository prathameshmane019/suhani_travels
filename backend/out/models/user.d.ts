import { Document } from 'mongoose';
export interface IUserDocument extends Document {
    name: string;
    phone?: string;
    age?: number;
    gender?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: import("mongoose").Model<IUserDocument, {}, {}, {}, Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.d.ts.map