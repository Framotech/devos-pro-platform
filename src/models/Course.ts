import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  thumbnail: string;
  price: number;
  link: string;
  techStack: string[];
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  published: boolean;
  tags: string[];
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    price: { type: Number, default: 0 },
    link: { type: String, required: true },
    techStack: { type: [String], default: [] },
    description: { type: String, default: '' },
    duration: { type: String, default: '' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    published: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);


const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export default Course;