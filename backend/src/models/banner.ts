import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  imageUrl: string;
  startDate: Date;
  imagePublicId: string;
  endDate: Date;
  isActive: boolean;
}

const bannerSchema: Schema = new Schema(
  {
    imageUrl: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    imagePublicId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.pre("find", function () {
  this.where({ endDate: { $gte: new Date() } });
});

export default mongoose.model<IBanner>("Banner", bannerSchema);