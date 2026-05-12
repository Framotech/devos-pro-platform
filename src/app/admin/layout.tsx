import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Cursor from '@/components/shared/Cursor';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/admin/sign-in');

  return (
    <>
      <Cursor />
      <div className="admin-shell" style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        <AdminSidebar />
        <div className="admin-main" style={{
          flex: 1,
          marginLeft: '260px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
    </>
  );
}
