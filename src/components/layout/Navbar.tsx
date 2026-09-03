"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Scale, PlusCircle, Menu, X, ShieldAlert, FileText, PhoneCall, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Public Registry", icon: FileText },
    { href: "/about", label: "Civic Charter & Anonymity", icon: ShieldAlert },
    { href: "/about#helplines", label: "ACB & Lokayukta Helplines", icon: PhoneCall },
    { href: "/admin", label: "Audit Console", icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black bg-white shadow-xs">
      {/* Black & White Top Notice Strip */}
      <div className="bg-black text-white text-[11px] font-mono tracking-wide py-1.5 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
            <span>INDEPENDENT CITIZEN REGISTRY • NON-PARTISAN WHISTLEBLOWER INITIATIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-zinc-400 text-[10px]">
            <span>Helpline: ACB / CVC 1064</span>
            <span className="text-zinc-600">|</span>
            <span>Zero IP Logging Architecture</span>
          </div>
        </div>
      </div>

      {/* Main Masthead Navigation */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded bg-black text-white border border-black group-hover:bg-zinc-800 transition-colors">
            <Scale className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-black font-serif">
                JANSEVA
              </span>
              <span className="rounded bg-zinc-100 border border-black px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-black uppercase">
                CIVIC ARCHIVE
              </span>
            </div>
            <p className="text-[11px] font-medium text-zinc-600 tracking-tight -mt-0.5">
              National Public Grievance & Bribe Documentation Registry
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-black ${isActive
                    ? "text-black border-b-2 border-black py-1"
                    : "text-zinc-600 hover:border-b-2 hover:border-zinc-400 py-1"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/report">
            <Button
              className="gap-2 bg-black text-white hover:bg-zinc-800 font-bold text-xs tracking-wide uppercase px-4 py-2 rounded shadow-xs"
            >
              <PlusCircle className="h-4 w-4 text-white" />
              File Anonymous Report
            </Button>
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/report">
            <Button size="sm" className="gap-1.5 text-xs bg-black text-white">
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              Report
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-black hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-black bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded px-3 py-2.5 text-xs font-bold uppercase tracking-wider ${isActive
                      ? "bg-black text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
