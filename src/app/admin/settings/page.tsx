import AdminHeader from '@/components/admin/AdminHeader';
import SettingsManager from '@/components/admin/SettingsManager';

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminHeader title="Settings" subtitle="Configure your site identity and features" />
      <SettingsManager />
    </div>
  );
}