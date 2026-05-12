import AdminHeader from '@/components/admin/AdminHeader';
import ProjectsManager from '@/components/admin/ProjectsManager';

export default function AdminProjectsPage() {
  return (
    <div>
      <AdminHeader
        title="Projects"
        subtitle="Manage your deployed containers"
      />
      <ProjectsManager />
    </div>
  );
}
