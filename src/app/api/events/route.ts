import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ startDate: 1 });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
