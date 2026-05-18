import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMediaItem extends Document {
  imageUrl: string;
  mediaType: 'image' | 'video';
  posterUrl?: string;
  caption?: string;
  eventId?: Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaItemSchema = new Schema<IMediaItem>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
      required: true,
    },
    posterUrl: {
      type: String,
    },
    caption: {
      type: String,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const MediaItem = mongoose.models.MediaItem || mongoose.model<IMediaItem>('MediaItem', MediaItemSchema);
