import Link from "next/link";
import { Scale, ShieldCheck, AlertOctagon, PhoneCall, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black bg-black text-white mt-auto">
      {/* Top Legal Notice Strip */}
      <div className="border-b border-zinc-800 bg-zinc-950 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <AlertOctagon className="h-4 w-4 text-white shrink-0" />
            <span>
              <strong>Statutory Civic Notice:</strong> JanSeva is an open documentation repository and does not deliver judicial judgments. Information is collected in public interest to support RTI queries, ACB inquiries, and institutional integrity.
            </span>
          </div>
          <Link
            href="/about#legal"
            className="text-white hover:underline font-bold font-mono text-[11px] uppercase shrink-0 inline-flex items-center gap-1"
          >
            Legal Disclaimer & Section 7 Notes
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-black border border-white">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white text-base font-serif tracking-wide">
                  JANSEVA ARCHIVE
                </span>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                  National Civic Integrity Project
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              Operating an independent, verifiable evidence ledger of public office demands, service delays, and illicit gratification across Indian States and Union Territories.
            </p>

            <div className="border-l-2 border-white pl-3 py-1 text-xs text-zinc-400 space-y-1">
              <p className="text-white font-bold flex items-center gap-1.5 font-mono text-[11px] uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
                Zero Identity Footprint Architecture
              </p>
              <p className="text-[11px]">
                IP addresses are hashed or discarded. All image EXIF GPS/camera data is scrubbed in-memory prior to persistence.
              </p>
            </div>
          </div>

          {/* Col 2: Official Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Official Grievance Portals
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2 text-white">
                <PhoneCall className="h-3 w-3 text-white" />
                <span>Anti-Corruption Helpline: <strong>1064</strong></span>
              </li>
              <li>
                <a
                  href="https://cvc.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  Central Vigilance Commission (CVC) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://rtionline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  RTI Online Portal ↗
                </a>
              </li>
              <li>
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  CPGRAMS Public Grievance Portal ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Registry Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Public Documentation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Browse Active Incident Dockets
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  File an Anonymous Affidavit
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Citizen Protection & Legal Rights
                </Link>
              </li>
              <li>
                <Link href="/about#guidelines" className="hover:text-white transition-colors">
                  Evidence Standards & Redaction Rules
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Registry Audit Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} JanSeva Public Integrity Archive. Dedicated to ethical governance.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
            <Link href="/about" className="hover:text-white">
              Anti-Doxxing Policy
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white">
              Anonymity Warrant
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
