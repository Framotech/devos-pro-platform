import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const item = await Testimonial.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(item);
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
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}