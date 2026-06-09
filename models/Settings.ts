import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  partnershipEmail: string;
  tagline: string;
  siteUrl: string;
  analyticsId?: string;
  joinTeamDescription: string;
  joinTeamGoogleFormUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    partnershipEmail: {
      type: String,
      default: 'info@rinwahospitality.com',
    },
    tagline: {
      type: String,
      default: 'Come here, you\'ve arrived home',
    },
    siteUrl: {
      type: String,
      default: 'https://rinwa.com',
    },
    analyticsId: {
      type: String,
    },
    joinTeamDescription: {
      type: String,
      default: 'As RÌNWÁ expands globally, we\'re building a team of thoughtful creatives, strategists, and cultural disruptors to help shape the future of culturally-driven hospitality and experiences.',
    },
    joinTeamGoogleFormUrl: {
      type: String,
      default: 'https://forms.gle/example',
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
