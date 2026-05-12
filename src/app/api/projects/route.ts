import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().min(1),
  description: z.string().min(1),
  caseStudy: z.string().optional(),
  githubLink: z.string().optional(),
  liveLink: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  status: z.enum(['running', 'exited', 'paused']).optional(),
  port: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1 });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const validated = projectSchema.parse(body);
    const project = await Project.create(validated);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
