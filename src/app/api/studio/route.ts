import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Studio from '@/models/Studio';

export async function GET() {
  try {
    await connectDB();
    const items = await Studio.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch studio work' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const item = await Studio.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create studio item' }, { status: 500 });
  }
}
