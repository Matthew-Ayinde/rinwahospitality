import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandPartner extends Document {
  name: string;
  region: 'Lagos' | 'Canada' | 'Hospitality' | 'Other';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandPartnerSchema = new Schema<IBrandPartner>(
  {
    name: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      enum: ['Lagos', 'Canada', 'Hospitality', 'Other'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const BrandPartner = mongoose.models.BrandPartner || mongoose.model<IBrandPartner>('BrandPartner', BrandPartnerSchema);
