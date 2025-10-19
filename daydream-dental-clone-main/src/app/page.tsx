import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero';
import ServicesGrid from '@/components/sections/services-grid';
import HackTxFooter from '@/components/sections/hacktx-footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <ServicesGrid />
      </main>
      <HackTxFooter />
    </div>
  );
}