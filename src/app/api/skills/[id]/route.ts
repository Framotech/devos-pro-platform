import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Skill from '@/models/Skill';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const skill = await Skill.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}