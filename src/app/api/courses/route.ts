import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

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
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
