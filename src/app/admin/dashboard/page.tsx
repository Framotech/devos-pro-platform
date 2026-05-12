import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Lead from '@/models/Lead';
import Post from '@/models/Post';
import Testimonial from '@/models/Testimonial';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardClient from '@/components/admin/DashboardClient';

async function getStats() {
  await connectDB();
  const [projects, leads, posts, testimonials, newLeads] = await Promise.all([
    Project.countDocuments(),
    Lead.countDocuments(),
    Post.countDocuments(),
    Testimonial.countDocuments({ approved: false }),
    Lead.countDocuments({ status: 'new' }),
  ]);
  return { projects, leads, posts, testimonials, newLeads };
}

async function getRecentLeads() {
  await connectDB();
  const leads = await Lead.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  return JSON.parse(JSON.stringify(leads));
}

export default async function DashboardPage() {
  const [stats, recentLeads] = await Promise.all([
    getStats(),
    getRecentLeads(),
  ]);

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back, Francis. Here's what's happening."
      />
      <DashboardClient stats={stats} recentLeads={recentLeads} />
    </div>
  );
}