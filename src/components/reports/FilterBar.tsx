"use client";

import { useEffect, useState } from "react";
import { Search, Filter, RotateCcw, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INCIDENT_CATEGORIES } from "@/types/report";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  selectedState: string;
  onStateChange: (val: string) => void;
  selectedDistrict: string;
  onDistrictChange: (val: string) => void;
  sort: "newest" | "oldest";
  onSortChange: (val: "newest" | "oldest") => void;
  onReset: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  sort,
  onSortChange,
  onReset,
}: FilterBarProps) {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    async function loadStates() {
      try {
        const res = await fetch("/api/locations/states");
        if (res.ok) {
          const data = await res.json();
          setStates(data.states || []);
        }
      } catch (e) {
        console.error("Failed to load states:", e);
      }
    }
    loadStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      return;
    }
    async function loadDistricts() {
      try {
        const res = await fetch(`/api/locations/districts?state=${encodeURIComponent(selectedState)}`);
        if (res.ok) {
          const data = await res.json();
          setDistricts(data.districts || []);
        }
      } catch (e) {
        console.error("Failed to load districts:", e);
      }
    }
    loadDistricts();
  }, [selectedState]);

  const hasActiveFilters = Boolean(search || category || selectedState || selectedDistrict || sort !== "newest");

  return (
    <div className="w-full bg-white border border-black rounded p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search docket by locality, office name, district, or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-9 h-10 bg-zinc-950 border-zinc-700 text-sm text-white placeholder:text-zinc-400 rounded focus:border-zinc-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-white hover:text-zinc-300 cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle on Mobile / Reset */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex-1 sm:flex-none gap-2 text-black border-black hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider h-10 rounded"
          >
            <Filter className="h-3.5 w-3.5 text-black" />
            <span>Jurisdiction Filters</span>
            {(selectedState || category || selectedDistrict) && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-black" />
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isFilterExpanded ? "rotate-180" : ""}`} />
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1 text-xs text-black hover:bg-zinc-100 h-10 font-bold uppercase tracking-wider"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Structured Select Filter Row */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-zinc-300 ${isFilterExpanded ? "block" : "hidden sm:grid"}`}>
        {/* Category */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black mb-1">
            Administrative Sector
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-9 px-3 rounded border border-black bg-white text-xs font-medium text-black focus:outline-none"
          >
            <option value="">All Administrative Sectors</option>
            {INCIDENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black mb-1">
            State / Union Territory
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              onStateChange(e.target.value);
              onDistrictChange("");
            }}
            className="w-full h-9 px-3 rounded border border-black bg-white text-xs font-medium text-black focus:outline-none"
          >
            <option value="">All States & UTs</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black mb-1">
            Administrative District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={!selectedState}
            className="w-full h-9 px-3 rounded border border-black bg-white text-xs font-medium text-black focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedState ? "All Districts in State" : "Select State First"}
            </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-black mb-1">
            Chronological Order
          </label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as "newest" | "oldest")}
            className="w-full h-9 px-3 rounded border border-black bg-white text-xs font-medium text-black focus:outline-none"
          >
            <option value="newest">Newest Incidents First</option>
            <option value="oldest">Oldest Historical Dockets</option>
          </select>
        </div>
      </div>
    </div>
  );
}
