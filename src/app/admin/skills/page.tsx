import AdminHeader from '@/components/admin/AdminHeader';
import SkillsManager from '@/components/admin/SkillsManager';

export default function AdminSkillsPage() {
  return (
    <div>
      <AdminHeader title="Skills" subtitle="Manage your tech stack" />
      <SkillsManager />
    </div>
  );
}