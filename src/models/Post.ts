import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  body: string;
  coverImage: string;
  category: 'Blog' | 'Event' | 'Hackathon' | 'Article';
  externalLink: string;
  published: boolean;
  tags: string[];
  readTime: number;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    category: { type: String, enum: ['Blog', 'Event', 'Hackathon', 'Article'], required: true },
    externalLink: { type: String, default: '' },
    published: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    readTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;