import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Video from '@/models/Video';
import Course from '@/models/Course';
import Post from '@/models/Post';
import Testimonial from '@/models/Testimonial';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import SiteConfig from '@/models/SiteConfig';

export async function GET() {
  try {
    await connectDB();

    const [projects, videos, courses, posts, testimonials, skills, experience, config] =
      await Promise.all([
        Project.find({ published: true }).sort({ order: 1 }),
        Video.find({ published: true }).sort({ createdAt: -1 }),
        Course.find({ published: true }).sort({ createdAt: -1 }),
        Post.find({ published: true }).sort({ createdAt: -1 }),
        Testimonial.find({ approved: true }).sort({ order: 1 }),
        Skill.find().sort({ order: 1 }),
        Experience.find().sort({ order: 1 }),
        SiteConfig.findOne(),
      ]);

    return NextResponse.json({
      projects,
      videos,
      courses,
      posts,
      testimonials,
      skills,
      experience,
      config,
    });
  } catch (error) {
    console.error('LAB ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab data', details: String(error) },
      { status: 500 }
    );
  }
}
