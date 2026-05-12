import AdminHeader from '@/components/admin/AdminHeader';
import EventsManager from '@/components/admin/EventsManager';

export default function AdminEventsPage() {
  return (
    <div>
      <AdminHeader title="Events" subtitle="Manage hackathons, contests, workshops and live sessions" />
      <EventsManager />
    </div>
  );
}
