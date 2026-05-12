import AdminHeader from '@/components/admin/AdminHeader';
import BlogManager from '@/components/admin/BlogManager';

export default function AdminBlogPage() {
  return (
    <div>
      <AdminHeader title="Blog Posts" subtitle="Manage your knowledge base" />
      <BlogManager />
    </div>
  );
}