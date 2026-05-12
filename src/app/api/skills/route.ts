import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Skill from '@/models/Skill';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.number().min(1).max(5),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ order: 1 });
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const validated = skillSchema.parse(body);
    const skill = await Skill.create(validated);
    return NextResponse.json(skill, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
