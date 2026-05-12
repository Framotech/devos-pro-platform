import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Experience from '@/models/Experience';

export async function GET() {
  try {
    await connectDB();
    const items = await Experience.find().sort({ order: 1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const item = await Experience.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
