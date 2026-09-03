"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IReport } from "@/types/report";

interface IncidentCardProps {
  report: IReport;
}

export function IncidentCard({ report }: IncidentCardProps) {
  const formattedDate = report.createdAt
    ? format(new Date(report.createdAt), "dd MMM yyyy")
    : "Recently";

  return (
    <Card className="group overflow-hidden border border-black bg-white hover:shadow-md transition-all duration-200 flex flex-col h-full rounded">
      {/* Official Case File Top Strip - Black & White */}
      <div className="bg-zinc-100 border-b border-black px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-black">
          <FileText className="h-3.5 w-3.5 text-black" />
          <span>DOCKET #{report.reportId}</span>
        </div>

        <div>
          {report.status === "published" ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-black bg-white border border-black px-2 py-0.5 rounded-xs uppercase">
              <CheckCircle2 className="h-3 w-3 text-black" />
              Verified Record
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-zinc-600 bg-zinc-200 border border-zinc-400 px-2 py-0.5 rounded-xs uppercase">
              <AlertCircle className="h-3 w-3 text-zinc-600" />
              Under Audit
            </span>
          )}
        </div>
      </div>

      {/* Evidence Frame with Monochromatic Redaction Seal */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
        <img
          src={report.imageUrl}
          alt={`Documented incident in ${report.location.area}, ${report.location.district}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-101"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* EXIF Sanitization Seal Watermark */}
        <div className="absolute bottom-2 right-2 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 rounded border border-zinc-700 flex items-center gap-1">
          <ShieldCheck className="h-2.5 w-2.5 text-white" />
          <span>EXIF PURGED • ANONYMIZED</span>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category & Location Details */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center rounded border border-black bg-zinc-100 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black">
            {report.category}
          </span>
          <span className="text-[11px] font-mono text-zinc-600">
            {formattedDate}
          </span>
        </div>

        {/* Administrative Location Breakdown */}
        <div className="flex items-start gap-1.5 text-xs text-white font-medium mb-3">
          <MapPin className="h-3.5 w-3.5 text-white mt-0.5 shrink-0" />
          <span className="leading-snug">
            <strong>{report.location.area}</strong>, {report.location.district}, {report.location.state}
          </span>
        </div>

        {/* Incident Narrative */}
        <p className="text-xs sm:text-sm text-zinc-800 line-clamp-3 mb-4 leading-relaxed font-normal bg-zinc-50 p-2.5 rounded border border-zinc-300 italic font-serif">
          &ldquo;{report.description || "Citizen reported unauthorized payment demands for public duty execution."}&rdquo;
        </p>

        {/* Footer Link to Full Docket */}
        <div className="mt-auto pt-3 border-t border-zinc-300 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
            <Calendar className="h-3 w-3 text-white" />
            <span>Filing: {formattedDate}</span>
          </div>
          <Link
            href={`/report/${report.reportId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline uppercase tracking-wider font-mono"
          >
            Examine Docket
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
