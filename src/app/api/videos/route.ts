import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video from '@/models/Video';
import { parseVideoSource } from '@/lib/video';

function normalizeVideoPayload(body: Record<string, unknown>) {
  const sourceUrl = String(body.sourceUrl || body.youtubeId || '').trim();
  const parsed = parseVideoSource(sourceUrl, String(body.youtubeId || ''));

  return {
    ...body,
    youtubeId: parsed.type === 'youtube' ? parsed.providerId : String(body.youtubeId || ''),
    sourceType: parsed.type === 'unknown' ? 'external' : parsed.type,
    sourceUrl: parsed.originalUrl,
    thumbnailUrl: String(body.thumbnailUrl || parsed.thumbnailUrl || ''),
  };
}

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
    const video = await Video.create(normalizeVideoPayload(body));
    return NextResponse.json(video, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}
