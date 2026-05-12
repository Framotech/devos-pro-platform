import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteConfig from '@/models/SiteConfig';

export async function GET() {
  try {
    await connectDB();
    let config = await SiteConfig.findOne();
    if (!config) config = await SiteConfig.create({});
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(body);
    } else {
      config = await SiteConfig.findByIdAndUpdate(config._id, body, { new: true });
    }
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}


