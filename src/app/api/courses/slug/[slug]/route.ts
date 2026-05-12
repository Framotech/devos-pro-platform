import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await params;
    const course = await Course.findOne({ slug, published: true });

    if (!course) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
