import mongoose, { Schema, Document } from 'mongoose';

export interface IRevenue extends Document {
  title: string;
  amount: number;
  currency: string;
  category: 'freelance' | 'saas' | 'course' | 'consulting' | 'other';
  client: string;
  project: string;
  status: 'received' | 'pending' | 'overdue';
  date: Date;
  notes: string;
}

const RevenueSchema = new Schema<IRevenue>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    category: {
      type: String,
      enum: ['freelance', 'saas', 'course', 'consulting', 'other'],
      default: 'freelance',
    },
    client: { type: String, default: '' },
    project: { type: String, default: '' },
    status: {
      type: String,
      enum: ['received', 'pending', 'overdue'],
      default: 'pending',
    },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Revenue = mongoose.models.Revenue || mongoose.model<IRevenue>('Revenue', RevenueSchema);
export default Revenue;
