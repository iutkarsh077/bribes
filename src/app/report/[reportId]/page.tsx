import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Scale,
  PhoneCall,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getReportById } from "@/lib/report-store";

export async function generateMetadata(props: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await props.params;
  const report = await getReportById(reportId);

  if (!report) {
    return { title: "Docket Not Found | JanSeva Archive" };
  }

  return {
    title: `Docket #${report.reportId} - ${report.category} | JanSeva Public Registry`,
    description: `Official citizen documentation docket: ${report.category} in ${report.location.area}, ${report.location.district}, ${report.location.state}.`,
  };
}

export default async function ReportDetailPage(props: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await props.params;
  const report = await getReportById(reportId);

  if (!report) {
    notFound();
  }

  const formattedDate = report.createdAt
    ? format(new Date(report.createdAt), "dd MMMM yyyy, hh:mm a")
    : "Verified Record";

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Breadcrumb Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline font-mono"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Registry Index
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-zinc-100 border border-black text-black px-3 py-1 rounded">
              DOCKET #{report.reportId}
            </span>
          </div>
        </div>

        {/* Main Docket Case File */}
        <div className="bg-white rounded border border-black shadow-xs overflow-hidden">
          {/* Official File Top Banner - Black & White */}
          <div className="bg-black text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-black">
            <div className="flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-white" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  PUBLIC INCIDENT RECORD
                </span>
                <span className="text-sm font-bold tracking-wide text-white">
                  {report.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {report.status === "published" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-white text-black border border-white px-3 py-1 rounded uppercase">
                  <CheckCircle2 className="h-3.5 w-3.5 text-black" />
                  Verified Public Record
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-600 px-3 py-1 rounded uppercase">
                  <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
                  Status: {report.status}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Photographic Evidence Frame */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-black">
                <span className="uppercase tracking-wider font-bold">Exhibited Photographic Evidence</span>
                <span className="flex items-center gap-1 text-black font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-black" />
                  EXIF Cleared & Redacted
                </span>
              </div>
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded overflow-hidden bg-black border border-black">
                <img
                  src={report.imageUrl}
                  alt={`Documentary evidence for docket ${report.reportId}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Official Metadata Registry Table */}
            <div className="border border-black rounded overflow-hidden bg-white">
              <div className="bg-zinc-100 border-b border-black px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">
                Case Metadata & Jurisdiction Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black">
                <div className="p-4 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-600 font-mono text-[10px] uppercase block font-bold">Jurisdiction & Locality</span>
                    <strong className="text-black text-sm">{report.location.area}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-600 font-mono text-[10px] uppercase block font-bold">District & State</span>
                    <span className="text-black font-medium">
                      {report.location.district}, {report.location.state}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-600 font-mono text-[10px] uppercase block font-bold">Filing Timestamp</span>
                    <strong className="text-black text-sm">{formattedDate}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-600 font-mono text-[10px] uppercase block font-bold">Verification Protocol</span>
                    <span className="text-black font-semibold flex items-center gap-1 mt-0.5 font-mono text-[11px]">
                      <Lock className="h-3 w-3 text-black" /> Anonymous 256-Bit Whistleblower Intake
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sworn Citizen Narrative */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                Documented Incident Statement
              </h3>
              <div className="p-5 rounded bg-zinc-50 border border-black text-sm leading-relaxed text-black italic font-serif">
                &ldquo;{report.description || "The citizen reporter did not attach additional written narrative. The photographic evidence above documents the unperformed public duty or illicit payment demand."}&rdquo;
              </div>
            </div>

            {/* Moderator Note if exists */}
            {report.moderationReason && (
              <div className="p-4 rounded bg-zinc-100 border border-black text-xs text-black font-mono">
                <strong>MODERATOR DOCKET NOTE:</strong> {report.moderationReason}
              </div>
            )}

            {/* Official Escalation Toolkit for Whistleblowers */}
            <div className="border border-black rounded p-5 bg-black text-white space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <PhoneCall className="h-4 w-4 text-white" />
                <h4 className="text-sm font-bold tracking-wide uppercase font-mono text-white">
                  Official Legal Escalation Toolkit
                </h4>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                If you are a party to or impacted by this incident, you can use this docket record (Ref: <strong className="text-white font-mono">#{report.reportId}</strong>) to escalate directly to statutory anti-corruption authorities:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="bg-zinc-900 border border-zinc-700 p-3 rounded space-y-1">
                  <span className="text-white font-bold font-mono text-[11px] block uppercase">1. Anti-Corruption Bureau</span>
                  <p className="text-zinc-300 text-[11px]">Dial toll-free <strong>1064</strong> to lodge a formal complaint with state vigilance.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-700 p-3 rounded space-y-1">
                  <span className="text-white font-bold font-mono text-[11px] block uppercase">2. Central Vigilance (CVC)</span>
                  <p className="text-zinc-300 text-[11px]">Submit online grievance at <strong>cvc.gov.in</strong> under PIDPI protection.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-700 p-3 rounded space-y-1">
                  <span className="text-white font-bold font-mono text-[11px] block uppercase">3. Right to Information</span>
                  <p className="text-zinc-300 text-[11px]">Demand officer duty logs & tender files at <strong>rtionline.gov.in</strong>.</p>
                </div>
              </div>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-4 rounded border border-black bg-zinc-100 text-black text-xs flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-black mt-0.5 shrink-0" />
              <span>
                <strong>Evidentiary Notice:</strong> JanSeva preserves citizen accounts for public transparency and does not make judicial findings. Authorities and investigators may review this record in furtherance of official proceedings.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
