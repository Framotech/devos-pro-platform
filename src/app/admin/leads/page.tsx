import AdminHeader from '@/components/admin/AdminHeader';
import LeadsManager from '@/components/admin/LeadsManager';

export default function AdminLeadsPage() {
  return (
    <div>
      <AdminHeader title="Leads / CRM" subtitle="Contact form submissions" />
      <LeadsManager />
    </div>
  );
}