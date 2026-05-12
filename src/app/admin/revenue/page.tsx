import AdminHeader from '@/components/admin/AdminHeader';
import RevenueManager from '@/components/admin/RevenueManager';

export default function AdminRevenuePage() {
  return (
    <div>
      <AdminHeader title="Revenue OS" subtitle="Track your income and billing" />
      <RevenueManager />
    </div>
  );
}
