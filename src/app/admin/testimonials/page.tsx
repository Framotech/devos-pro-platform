import AdminHeader from '@/components/admin/AdminHeader';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

export default function AdminTestimonialsPage() {
  return (
    <div>
      <AdminHeader title="Testimonials" subtitle="Approve and manage reviews" />
      <TestimonialsManager />
    </div>
  );
}