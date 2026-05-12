import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const item = await Testimonial.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
