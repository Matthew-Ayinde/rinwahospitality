import mongoose, { Schema, Document } from 'mongoose';

export interface IPastEventMedia extends Document {
  imageUrl: string;
  mediaType: 'image' | 'video';
  posterUrl?: string;
  caption?: string;
  order: number;
  isActive: boolean;
}

export interface IPastEvent extends Document {
  title: string;
  category: string;
  year: string;
  description: string;
  media: IPastEventMedia[];
  span?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PastEventMediaSchema = new Schema<IPastEventMedia>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    posterUrl: {
      type: String,
    },
    caption: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const PastEventSchema = new Schema<IPastEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    media: [PastEventMediaSchema],
    span: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const PastEvent =
  mongoose.models.PastEvent || mongoose.model<IPastEvent>('PastEvent', PastEventSchema);
