import AdminHeader from '@/components/admin/AdminHeader';
import VideosManager from '@/components/admin/VideosManager';

export default function AdminVideosPage() {
  return (
    <div>
      <AdminHeader title="Videos" subtitle="Manage your YouTube content" />
      <VideosManager />
    </div>
  );
}