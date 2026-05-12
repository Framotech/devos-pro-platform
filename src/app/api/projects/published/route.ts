import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
