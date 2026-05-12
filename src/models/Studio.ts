import mongoose, { Schema, Document } from 'mongoose';

export interface IStudio extends Document {
  title: string;
  description: string;
  category: 'UI Design' | 'Web Graphics' | 'Branding' | 'Motion';
  tools: string[];
  coverImage: string;
  images: string[];
  figmaLink: string;
  behanceLink: string;
  dribbbleLink: string;
  liveLink: string;
  published: boolean;
  featured: boolean;
  order: number;
}

const StudioSchema = new Schema<IStudio>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['UI Design', 'Web Graphics', 'Branding', 'Motion'],
      required: true,
    },
    tools: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },
    figmaLink: { type: String, default: '' },
    behanceLink: { type: String, default: '' },
    dribbbleLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Studio = mongoose.models.Studio || mongoose.model<IStudio>('Studio', StudioSchema);
export default Studio;
