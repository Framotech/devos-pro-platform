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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const video = await Video.findByIdAndUpdate(id, normalizeVideoPayload(body), { new: true });
    return NextResponse.json(video);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Video.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
