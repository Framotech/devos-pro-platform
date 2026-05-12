import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  youtubeId: string;
  category: string;
  description: string;
  duration: string;
  isFeatured: boolean;
  published: boolean;
  views: number;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    youtubeId: { type: String, required: true, unique: true },
    category: { type: String, default: 'Tutorial' },
    description: { type: String, default: '' },
    duration: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
export default Video;