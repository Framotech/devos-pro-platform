import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video from '@/models/Video';

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ createdAt: -1 });
    return NextResponse.json(videos);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const video = await Video.create(body);
    return NextResponse.json(video, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}
