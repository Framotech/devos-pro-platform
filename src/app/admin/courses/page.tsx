import AdminHeader from '@/components/admin/AdminHeader';
import CoursesManager from '@/components/admin/CoursesManager';

export default function AdminCoursesPage() {
  return (
    <div>
      <AdminHeader title="Courses" subtitle="Manage your academy courses" />
      <CoursesManager />
    </div>
  );
}