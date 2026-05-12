import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  slug: string;
  image: string;
  description: string;
  caseStudy: string;
  githubLink: string;
  liveLink: string;
  techStack: string[];
  status: 'running' | 'exited' | 'paused';
  port: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    caseStudy: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    status: { type: String, enum: ['running', 'exited', 'paused'], default: 'running' },
    port: { type: String, default: '80:80' },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
 
