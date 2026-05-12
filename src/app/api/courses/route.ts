import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeCoursePayload(body: Record<string, unknown>) {
  const title = String(body.title || '');
  return {
    ...body,
    slug: String(body.slug || slugify(title)),
  };
}

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const course = await Course.create(normalizeCoursePayload(body));
    return NextResponse.json(course, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
