import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/reports/HeroSection";
import { IncidentFeed } from "@/components/reports/IncidentFeed";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <IncidentFeed />
      </main>
      <Footer />
    </div>
  );
}
