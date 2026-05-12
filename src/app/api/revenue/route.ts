import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Revenue from '@/models/Revenue';

export async function GET() {
  try {
    await connectDB();
    const entries = await Revenue.find().sort({ date: -1 });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const entry = await Revenue.create(body);
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
