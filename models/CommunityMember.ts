import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityMember extends Document {
  email: string;
  firstName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityMemberSchema = new Schema<ICommunityMember>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    firstName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const CommunityMember =
  mongoose.models.CommunityMember ||
  mongoose.model<ICommunityMember>('CommunityMember', CommunityMemberSchema);
