"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FilterBar } from "./FilterBar";
import { IncidentCard } from "./IncidentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IReport } from "@/types/report";
import { PlusCircle, ChevronLeft, ChevronRight, FileSearch, Scale } from "lucide-react";

export function IncidentFeed() {
  const [reports, setReports] = useState<IReport[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (selectedState) params.set("state", selectedState);
      if (selectedDistrict) params.set("district", selectedDistrict);
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("limit", "9");

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, selectedState, selectedDistrict, sort, page]);

  // Debounce search/filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchReports]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
  };

  const handleStateChange = (val: string) => {
    setSelectedState(val);
    setPage(1);
  };

  const handleDistrictChange = (val: string) => {
    setSelectedDistrict(val);
    setPage(1);
  };

  const handleSortChange = (val: "newest" | "oldest") => {
    setSort(val);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSelectedState("");
    setSelectedDistrict("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div id="feed" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Registry Feed Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black font-serif">
              National Incident Registry
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl">
            Public documentation ledger of authenticated citizen affidavits detailing unauthorized gratification demands across state and municipal authorities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-black bg-zinc-100 border border-black px-3 py-1.5 rounded">
            INDEXED: {total} {total === 1 ? "RECORD" : "RECORDS"}
          </span>
          <Link href="/report">
            <Button size="sm" className="gap-1.5 font-bold uppercase tracking-wider text-xs bg-black text-white hover:bg-zinc-800 rounded">
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              File Affidavit
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        selectedState={selectedState}
        onStateChange={handleStateChange}
        selectedDistrict={selectedDistrict}
        onDistrictChange={handleDistrictChange}
        sort={sort}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded border border-zinc-300 bg-white p-4 space-y-3">
              <Skeleton className="aspect-[16/10] w-full rounded bg-zinc-200" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28 bg-zinc-200" />
                <Skeleton className="h-4 w-16 bg-zinc-200" />
              </div>
              <Skeleton className="h-4 w-3/4 bg-zinc-200" />
              <Skeleton className="h-14 w-full bg-zinc-200" />
            </div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <IncidentCard key={report.reportId} report={report} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-black pt-6">
              <p className="text-xs font-mono text-black">
                REGISTRY PAGE <span className="font-bold text-black">{page}</span> OF{" "}
                <span className="font-bold text-black">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="gap-1 text-xs uppercase tracking-wider font-bold border-black rounded text-black hover:bg-zinc-100"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="gap-1 text-xs uppercase tracking-wider font-bold border-black rounded text-black hover:bg-zinc-100"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded border border-dashed border-black bg-zinc-50 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-black text-white">
            <FileSearch className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-black uppercase font-mono tracking-wide">
              No Documented Records in Selected Jurisdiction
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              No citizen affidavits currently match these specific filter parameters. If you have experienced unauthorized payment demands in this area, document it below.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs border-black text-black font-bold uppercase rounded">
              Clear Filters
            </Button>
            <Link href="/report">
              <Button size="sm" className="gap-1.5 text-xs bg-black text-white hover:bg-zinc-800 font-bold uppercase rounded">
                <PlusCircle className="h-3.5 w-3.5 text-white" />
                File New Incident
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Public Interest Standard Notice */}
      <div className="rounded border border-black bg-zinc-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-black">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-black shrink-0" />
          <div>
            <strong className="text-black">Whistleblower & Evidentiary Standard:</strong>
            <p className="text-zinc-600 text-[11px] mt-0.5">
              Reports are curated strictly for non-partisan public interest. Content is screened to strip private personal identifiers while preserving public office accountability.
            </p>
          </div>
        </div>
        <Link href="/about#legal" className="font-bold text-black underline hover:opacity-75 shrink-0 text-xs uppercase font-mono">
          View Redaction Charter →
        </Link>
      </div>
    </div>
  );
}
