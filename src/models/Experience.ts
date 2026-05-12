import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  technologies: string[];
  current: boolean;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    highlights: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const Experience = mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
export default Experience;
