import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  avatar: string;
  resume: string;
  github: string;
  twitter: string;
  linkedin: string;
  website: string;
  theme: string;
  seoTitle: string;
  seoDesc: string;
  ogImage: string;
  showBlog: boolean;
  showVideos: boolean;
  showCourses: boolean;
  showHireMe: boolean;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    name: { type: String, default: 'Framo' },
    title: { type: String, default: 'Software Engineer & DevOps' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: 'Accra, Ghana' },
    availability: { type: String, default: 'open' },
    avatar: { type: String, default: '' },
    resume: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    theme: { type: String, default: 'dark' },
    seoTitle: { type: String, default: '' },
    seoDesc: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    showBlog: { type: Boolean, default: true },
    showVideos: { type: Boolean, default: true },
    showCourses: { type: Boolean, default: true },
    showHireMe: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SiteConfig = mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
export default SiteConfig;