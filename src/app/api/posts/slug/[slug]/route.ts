import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug, published: true });

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
