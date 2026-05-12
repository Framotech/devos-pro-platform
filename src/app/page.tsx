import PublicLayout from '@/components/shared/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import HomeFeatured from '@/components/sections/HomeFeatured';
import HomeEvents from '@/components/sections/HomeEvents';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutSection />
      <HomeFeatured />
      <HomeEvents />
      <TestimonialsSection />
    </PublicLayout>
  );
}