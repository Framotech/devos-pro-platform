import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Studio from '@/models/Studio';

export async function GET() {
  try {
    await connectDB();
    const items = await Studio.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch studio work' }, { status: 500 });
  }
}
