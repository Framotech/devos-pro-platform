import Navbar from '@/components/shared/Navbar';
import Cursor from '@/components/shared/Cursor';
import Footer from '@/components/shared/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <Navbar />
      <main className="public-main">
        {children}
      </main>
      <Footer />
    </>
  );
}
