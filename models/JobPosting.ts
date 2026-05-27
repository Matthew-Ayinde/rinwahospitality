import mongoose, { Schema, Document } from 'mongoose';

export interface IJobPosting extends Document {
  title: string;
  company: string;
  location: string;
  type: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobPostingSchema = new Schema<IJobPosting>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    overview: { type: String, required: true },
    responsibilities: { type: [String], required: true, default: [] },
    requirements: { type: [String], required: true, default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const JobPosting = mongoose.models.JobPosting || mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);
