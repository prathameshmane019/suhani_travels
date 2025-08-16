import mongoose, { Document } from "mongoose";
export interface IBanner extends Document {
    imageUrl: string;
    startDate: Date;
    imagePublicId: string;
    endDate: Date;
    isActive: boolean;
}
declare const _default: mongoose.Model<IBanner, {}, {}, {}, mongoose.Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=banner.d.ts.map