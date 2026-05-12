import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'hackathon' | 'contest' | 'workshop' | 'live' | 'community' | 'competition';
  coverImage: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isOnline: boolean;
  registrationLink: string;
  prize: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'ended';
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['hackathon', 'contest', 'workshop', 'live', 'community', 'competition'],
      required: true,
    },
    coverImage: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, default: '' },
    isOnline: { type: Boolean, default: true },
    registrationLink: { type: String, default: '' },
    prize: { type: String, default: '' },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['upcoming', 'ongoing', 'ended'], default: 'upcoming' },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;
