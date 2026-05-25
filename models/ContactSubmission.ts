import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  projectDate: string;
  estimatedBudget: number;
  currency: string;
  description: string;
  industries: string[];
  industry?: string;
  goals: string[];
  feelings: string[];
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    projectDate: {
      type: String,
      required: true,
    },
    estimatedBudget: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'NGN',
    },
    description: {
      type: String,
      required: true,
    },
    industries: {
      type: [String],
      default: [],
    },
    goals: {
      type: [String],
      default: [],
    },
    feelings: {
      type: [String],
      default: [],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ContactSubmission = mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
