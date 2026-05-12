import AdminHeader from '@/components/admin/AdminHeader';
import ExperienceManager from '@/components/admin/ExperienceManager';

export default function AdminExperiencePage() {
  return (
    <div>
      <AdminHeader title="Experience" subtitle="Manage your career timeline" />
      <ExperienceManager />
    </div>
  );
}