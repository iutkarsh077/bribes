import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReportWizard } from "@/components/forms/ReportWizard";

export const metadata = {
  title: "File Anonymous Affidavit | JanSeva Public Registry",
  description: "Anonymously document unauthorized bribe demands or public service failures in under a minute.",
};

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Navbar />
      <main className="flex-1">
        <ReportWizard />
      </main>
      <Footer />
    </div>
  );
}
