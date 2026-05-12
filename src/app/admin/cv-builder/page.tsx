import AdminHeader from '@/components/admin/AdminHeader';
import CVBuilderClient from '@/components/admin/cv/CVBuilderClient';

export default function CVBuilderPage() {
  return (
    <div>
      <AdminHeader
        title="AI CV Studio"
        subtitle="Generate, preview, export, and share recruiter-grade CVs."
      />
      <CVBuilderClient />
    </div>
  );
}
