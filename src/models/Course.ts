import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  bannerImage: string;
  price: number;
  link: string;
  instructor: string;
  category: string;
  introVideoUrl: string;
  enrollmentStatus: 'open' | 'waitlist' | 'closed';
  curriculum: string[];
  lessons: string[];
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
    slug: { type: String, default: '', index: true },
    thumbnail: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    price: { type: Number, default: 0 },
    link: { type: String, default: '' },
    instructor: { type: String, default: 'Framo' },
    category: { type: String, default: 'Development' },
    introVideoUrl: { type: String, default: '' },
    enrollmentStatus: {
      type: String,
      enum: ['open', 'waitlist', 'closed'],
      default: 'open',
    },
    curriculum: { type: [String], default: [] },
    lessons: { type: [String], default: [] },
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
