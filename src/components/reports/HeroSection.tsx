"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, ShieldCheck, MapPin, FileCheck, Layers, ArrowRight, Lock, Scale, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportStats } from "@/types/report";

export function HeroSection() {
  const [stats, setStats] = useState<ReportStats>({
    totalSubmitted: 0,
    totalPublished: 0,
    statesCovered: 0,
    districtsCovered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="relative bg-white text-black border-b border-black">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Institutional Monochromatic Badge */}
          <div className="inline-flex items-center gap-2 rounded border border-black bg-zinc-100 px-3 py-1 text-xs font-mono font-bold text-black uppercase tracking-wider">
            <Scale className="h-3.5 w-3.5 text-black" />
            <span>CITIZEN INTEGRITY ARCHIVE • SEC. 7 POCA DOCUMENTATION</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-black font-serif leading-[1.15]">
            An Independent Public Registry of Bribe Demands & Civic Extortion.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-700 leading-relaxed font-normal max-w-2xl">
            A secure, non-partisan repository for citizens to document unauthorized payment demands, harassment, and deliberate service delays across state and municipal offices.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link href="/report">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs tracking-wider uppercase px-6 rounded shadow-sm"
              >
                <PlusCircle className="h-4 w-4 text-white" />
                File Anonymous Report
              </Button>
            </Link>
            <a href="#feed">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 text-black border-2 border-black bg-white hover:bg-zinc-100 text-xs font-bold tracking-wider uppercase px-5 rounded"
              >
                Search Public Dockets
                <ArrowRight className="h-4 w-4 text-black" />
              </Button>
            </a>
          </div>
        </div>

        {/* 3 Pillars of Whistleblower Security */}
        <div className="mt-14 pt-8 border-t border-zinc-300 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 bg-zinc-50 border border-black rounded p-4">
            <div className="p-2 rounded bg-black text-white shrink-0">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                Zero Identity Footprint
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-normal">
                No accounts, emails, or phone numbers required. Camera EXIF and GPS device metadata are scrubbed in memory.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-zinc-50 border border-black rounded p-4">
            <div className="p-2 rounded bg-black text-white shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                Evidence Redaction Protocol
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-normal">
                All incident dockets are screened to redact private personal data, prevent doxxing, and verify public service context.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-zinc-50 border border-black rounded p-4">
            <div className="p-2 rounded bg-black text-white shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                Official Escalation Format
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-normal">
                Every report generates a verifiable docket reference number formatted for forwarding to ACB / Lokayukta / CVC.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Ledger */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="bg-white border border-black rounded p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-600 uppercase">Documented Cases</span>
              <Layers className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-black mt-1">
              {loading ? "..." : stats.totalSubmitted}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Citizen affidavits filed</p>
          </div>

          <div className="bg-white border border-black rounded p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-600 uppercase">Verified Records</span>
              <FileCheck className="h-3.5 w-3.5 text-black" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-black mt-1">
              {loading ? "..." : stats.totalPublished}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Published into public archive</p>
          </div>

          <div className="bg-white border border-black rounded p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-600 uppercase">States & UTs</span>
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-black mt-1">
              {loading ? "..." : stats.statesCovered}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Jurisdictions under observation</p>
          </div>

          <div className="bg-white border border-black rounded p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-600 uppercase">Districts Covered</span>
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-black mt-1">
              {loading ? "..." : stats.districtsCovered}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Local administrative zones</p>
          </div>
        </div>
      </div>
    </section>
  );
}
