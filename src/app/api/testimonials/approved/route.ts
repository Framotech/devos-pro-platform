import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find({ approved: true }).sort({ order: 1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
