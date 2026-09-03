import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Scale,
  EyeOff,
  FileCheck,
  AlertTriangle,
  PlusCircle,
  PhoneCall,
  Lock,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Civic Charter & Legal Framework | JanSeva Public Archive",
  description: "Learn about the mission, legal compliance, and technological whistleblower protections behind the JanSeva Public Integrity Archive.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Masthead Header */}
        <div className="text-center space-y-4 border-b border-black pb-8">
          <div className="inline-flex items-center gap-2 rounded border border-black bg-zinc-100 px-3 py-1 text-xs font-mono font-bold text-black uppercase tracking-widest">
            <Scale className="h-3.5 w-3.5 text-black" />
            CIVIC CHARTER & STATUTORY NOTICE
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black font-serif">
            Public Integrity Charter & Legal Protections
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 max-w-2xl mx-auto leading-relaxed">
            The operational guidelines, technical privacy safeguards, and evidentiary standards governing the JanSeva Public Documentation Archive.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded border border-black bg-white p-6 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded bg-black text-white flex items-center justify-center">
              <EyeOff className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
              Zero-Trace Anonymity
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              No registration, email, phone number, or login identity is ever demanded. Camera serials, timestamps, and GPS EXIF tags are scrubbed in memory before image storage.
            </p>
          </div>

          <div className="rounded border border-black bg-white p-6 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded bg-black text-white flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
              Section 7 POCA Alignment
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Designed to document illicit gratification under the Prevention of Corruption Act (1988), creating a verifiable factual record to support statutory ACB inquiries.
            </p>
          </div>

          <div className="rounded border border-black bg-white p-6 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded bg-black text-white flex items-center justify-center">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
              Strict Redaction Policy
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Submissions undergo screening to purge private residential details, innocent bystander identities, personal phone numbers, and defamatory attacks before publication.
            </p>
          </div>
        </div>

        {/* Legal Context & Framework */}
        <div className="rounded border border-black bg-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-black pb-3">
            <FileText className="h-4 w-4 text-black" />
            <h2 className="text-base font-bold uppercase tracking-wider text-black font-mono">
              Statutory Context: Prevention of Corruption Act (1988)
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-zinc-800 space-y-3 leading-relaxed">
            <p>
              Under <strong>Section 7 of the Prevention of Corruption (Amendment) Act, 2018</strong>, any public servant who obtains, accepts, or attempts to obtain from another person an undue advantage, with the intention to perform or cause performance of a public duty improperly or dishonestly, is liable for criminal prosecution.
            </p>
            <p>
              Furthermore, Section 8 protects citizens who are coerced into giving undue advantage, provided they report the matter to law enforcement or an anti-corruption agency within <strong>seven days</strong> of such occurrence. JanSeva provides citizens with a structured, timestamped affidavit format to preserve contemporaneous evidence.
            </p>
          </div>
        </div>

        {/* Evidence Redaction & Citizen Conduct Rules */}
        <div id="guidelines" className="rounded border border-black bg-zinc-100 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-black font-bold text-base font-mono">
            <AlertTriangle className="h-5 w-5 text-black" />
            <h2>Evidentiary Standards & Anti-Doxxing Code</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
            To protect innocent individuals and maintain the highest standard of public integrity, all citizen reports must comply with the following redaction standards:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-black list-disc list-inside">
            <li><strong>No Private Contact Information:</strong> Do not submit private home addresses, personal mobile numbers, or private social media links.</li>
            <li><strong>No National Identity Documents:</strong> Photos of Aadhaar cards, PAN cards, voter identification, or bank passbooks will be rejected immediately.</li>
            <li><strong>Focus Strictly on Public Duties:</strong> Document delayed files, road contracts, licensing delays, police non-registration, hospital counters, or municipal fee demands.</li>
            <li><strong>Factual, Objective Descriptions:</strong> Describe the administrative demand clearly without abusive language or communal slurs.</li>
          </ul>
        </div>

        {/* Official Escalation Helplines Directory */}
        <div id="helplines" className="rounded border border-black bg-black text-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <PhoneCall className="h-4 w-4 text-white" />
            <h2 className="text-base font-bold uppercase tracking-wider text-white font-mono">
              National Anti-Corruption Helplines & Authorities
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            JanSeva is an open documentation project. Citizens facing active extortion or coercion should also notify the appropriate statutory authorities immediately:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-zinc-900 border border-zinc-700 p-4 rounded space-y-2">
              <span className="font-bold text-white font-mono text-sm block uppercase">Anti-Corruption Bureau (ACB)</span>
              <p className="text-zinc-300">Toll-Free National Helpline: <strong className="text-white text-sm font-mono">1064</strong></p>
              <p className="text-zinc-400 text-[11px]">Available across Indian states for reporting ongoing bribery and trapping corrupt officials.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-700 p-4 rounded space-y-2">
              <span className="font-bold text-white font-mono text-sm block uppercase">Central Vigilance Commission (CVC)</span>
              <p className="text-zinc-300">Official Portal: <a href="https://cvc.gov.in" target="_blank" rel="noreferrer" className="text-white underline font-mono">cvc.gov.in</a></p>
              <p className="text-zinc-400 text-[11px]">Central government authority receiving disclosures under the Public Interest Disclosure (PIDPI) resolution.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-700 p-4 rounded space-y-2">
              <span className="font-bold text-white font-mono text-sm block uppercase">RTI Online Portal</span>
              <p className="text-zinc-300">Official Portal: <a href="https://rtionline.gov.in" target="_blank" rel="noreferrer" className="text-white underline font-mono">rtionline.gov.in</a></p>
              <p className="text-zinc-400 text-[11px]">File statutory requests for tender files, inspection logs, sanction orders, and duty records.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-700 p-4 rounded space-y-2">
              <span className="font-bold text-white font-mono text-sm block uppercase">CPGRAMS Grievance Portal</span>
              <p className="text-zinc-300">Official Portal: <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="text-white underline font-mono">pgportal.gov.in</a></p>
              <p className="text-zinc-400 text-[11px]">Centralized public grievance redress and monitoring system managed by DARPG.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link href="/report">
            <Button size="lg" className="gap-2 font-bold uppercase tracking-wider text-xs bg-black hover:bg-zinc-800 text-white px-8 py-3 rounded">
              <PlusCircle className="h-4 w-4 text-white" />
              File an Anonymous Citizen Report
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
