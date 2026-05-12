import AdminHeader from '@/components/admin/AdminHeader';
import StudioManager from '@/components/admin/StudioManager';

export default function AdminStudioPage() {
  return (
    <div>
      <AdminHeader title="Studio" subtitle="Manage your design and visual work" />
      <StudioManager />
    </div>
  );
}
