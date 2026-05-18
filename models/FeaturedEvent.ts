import mongoose, { Schema, Document } from 'mongoose';

export interface IEventMedia extends Document {
  imageUrl: string;
  mediaType: 'image' | 'video';
  posterUrl?: string;
  caption?: string;
  order: number;
  isActive: boolean;
}

export interface IFeaturedEvent extends Document {
  title: string;
  subtitle: string;
  description: string;
  location: string;
  date: string;
  time: string;
  media: IEventMedia[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventMediaSchema = new Schema<IEventMedia>(
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

const FeaturedEventSchema = new Schema<IFeaturedEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    media: [EventMediaSchema],
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

export const FeaturedEvent =
  mongoose.models.FeaturedEvent || mongoose.model<IFeaturedEvent>('FeaturedEvent', FeaturedEventSchema);
