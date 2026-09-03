"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Lock,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Eye,
  LogOut,
  RefreshCw,
  Layers,
  MapPin,
  Scale,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IReport, ReportStatus } from "@/types/report";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Reports state
  const [reports, setReports] = useState<IReport[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "published" | "rejected" | "removed">("pending");
  const [search, setSearch] = useState("");
  const [loadingReports, setLoadingReports] = useState(false);

  // Moderation Dialog state
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [inspectDialogOpen, setInspectDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Invalid authentication credentials.");
      }
    } catch (err: any) {
      setLoginError("Authentication failure. Please verify credentials.");
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  // Fetch reports for current tab
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminReports();
    }
  }, [isAuthenticated, activeTab, search]);

  const fetchAdminReports = async () => {
    setLoadingReports(true);
    try {
      const params = new URLSearchParams();
      params.set("status", activeTab);
      if (search.trim()) params.set("search", search.trim());
      params.set("limit", "50");

      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error("Failed to load admin reports:", e);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: ReportStatus,
    reason?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          moderationReason: reason || "",
        }),
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.reportId !== reportId));
        setRejectDialogOpen(false);
        setInspectDialogOpen(false);
        setRejectionReason("");
        setSelectedReport(null);
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (err) {
      alert("Error updating report status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans text-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin text-black mx-auto" />
            <p className="text-xs font-mono text-zinc-600">Verifying session authority...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans text-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-black rounded p-8 shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded bg-black text-white flex items-center justify-center border border-black">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-black font-serif">
                Registry Audit & Verification Console
              </h1>
              <p className="text-xs text-zinc-600">
                Authorized verification officers only. Review submissions, sanitize personal details, and verify public service records.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black mb-1">
                  Audit Access Passcode
                </label>
                <Input
                  type="password"
                  placeholder="Enter administrator passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-xs bg-white border-black"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-black bg-zinc-100 p-2.5 rounded border border-black font-mono">
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                size="default"
                disabled={loadingLogin}
                className="w-full bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider h-10 rounded"
              >
                {loadingLogin ? "Verifying..." : "Access Audit Console"}
              </Button>
            </form>

            <div className="border-t border-zinc-200 pt-4 text-center">
              <p className="text-[11px] font-mono text-zinc-500">
                Protected Administrative Endpoint • Governed by Whistleblower Privacy Protocol
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-black" />
              <h1 className="text-2xl font-bold tracking-tight text-black font-serif">
                Public Registry Audit & Verification Desk
              </h1>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Review citizen submissions, verify public office context, redact accidental personal identifiers, and approve or dismiss dockets.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAdminReports}
              className="gap-1.5 text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 rounded border border-black"
            >
              <LogOut className="h-3 w-3" />
              Exit Console
            </Button>
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${activeTab === "pending"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black hover:bg-zinc-100"
                }`}
            >
              Pending Audit
            </button>
            <button
              onClick={() => setActiveTab("published")}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${activeTab === "published"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black hover:bg-zinc-100"
                }`}
            >
              Published Records
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${activeTab === "rejected"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black hover:bg-zinc-100"
                }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setActiveTab("removed")}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${activeTab === "removed"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black hover:bg-zinc-100"
                }`}
            >
              Taken Down
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black" />
            <Input
              type="text"
              placeholder="Search docket ID, area, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-xs bg-white border-black"
            />
          </div>
        </div>

        {/* Reports Table / Card List */}
        {loadingReports ? (
          <div className="py-20 text-center text-zinc-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-black" />
            <p className="text-xs font-mono">Loading docket entries...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-black rounded bg-white">
            <Layers className="h-8 w-8 text-black mx-auto mb-2" />
            <h3 className="text-sm font-bold uppercase font-mono text-black">
              No entries in {activeTab} queue
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              There are currently no records marked as &ldquo;{activeTab}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-black rounded overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 border-b border-black text-black uppercase tracking-wider font-mono font-bold">
                  <tr>
                    <th className="p-3">Docket ID</th>
                    <th className="p-3">Evidence</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Narrative</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {reports.map((report) => (
                    <tr key={report.reportId} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-black whitespace-nowrap">
                        #{report.reportId}
                      </td>
                      <td className="p-3">
                        <img
                          src={report.imageUrl}
                          alt="Thumbnail"
                          className="h-10 w-14 object-cover rounded border border-black cursor-pointer hover:opacity-80 grayscale"
                          onClick={() => {
                            setSelectedReport(report);
                            setInspectDialogOpen(true);
                          }}
                        />
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-bold text-black font-mono">
                          {report.category}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-black">
                          <MapPin className="h-3 w-3 text-black shrink-0" />
                          <span>{report.location.area}, {report.location.district}</span>
                        </div>
                      </td>
                      <td className="p-3 max-w-xs">
                        <p className="line-clamp-2 text-zinc-700 italic font-serif">
                          {report.description || "No narrative attached."}
                        </p>
                      </td>
                      <td className="p-3 whitespace-nowrap text-black font-mono">
                        {report.createdAt ? format(new Date(report.createdAt), "dd MMM yyyy") : ""}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setInspectDialogOpen(true);
                          }}
                          className="h-7 px-2 text-xs gap-1 border-black font-bold uppercase tracking-wider text-black hover:bg-zinc-100 rounded"
                        >
                          <Eye className="h-3 w-3" />
                          Audit
                        </Button>

                        {report.status !== "published" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(report.reportId, "published")}
                            className="h-7 px-2 text-xs bg-black hover:bg-zinc-800 text-white gap-1 font-bold uppercase tracking-wider rounded"
                          >
                            <CheckCircle className="h-3 w-3 text-white" />
                            Approve
                          </Button>
                        )}

                        {report.status !== "rejected" && report.status !== "removed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setRejectDialogOpen(true);
                            }}
                            className="h-7 px-2 text-xs gap-1 font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </Button>
                        )}

                        {report.status === "published" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(report.reportId, "removed", "Removed by administrator")}
                            className="h-7 px-2 text-xs border-black text-black hover:bg-zinc-100 gap-1 font-bold uppercase tracking-wider rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                            Take Down
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: Inspect Report Details Dialog */}
        <Dialog open={inspectDialogOpen} onOpenChange={setInspectDialogOpen}>
          {selectedReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <div className="bg-white rounded border border-black max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-black">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold font-mono uppercase tracking-wider">
                    Docket #{selectedReport.reportId} Audit Review
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-600">
                    Verify photographic evidence, redact any accidental personal numbers or private addresses, and determine publication readiness.
                  </DialogDescription>
                </DialogHeader>

                {/* Evidence Image Full */}
                <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-black border border-black">
                  <img
                    src={selectedReport.imageUrl}
                    alt="Inspection target"
                    className="h-full w-full object-contain grayscale"
                  />
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded border border-black text-xs">
                  <div>
                    <span className="text-zinc-600 font-mono text-[10px] uppercase font-bold">Sector</span>
                    <p className="font-bold text-black">{selectedReport.category}</p>
                  </div>
                  <div>
                    <span className="text-zinc-600 font-mono text-[10px] uppercase font-bold">Jurisdiction</span>
                    <p className="font-bold text-black">
                      {selectedReport.location.area}, {selectedReport.location.district}, {selectedReport.location.state}
                    </p>
                  </div>
                </div>

                {/* Description narrative */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold">
                    Documented Statement
                  </span>
                  <div className="p-3 rounded bg-zinc-50 border border-black text-xs italic font-serif text-black">
                    &ldquo;{selectedReport.description || "No text description provided."}&rdquo;
                  </div>
                </div>

                <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInspectDialogOpen(false)}
                    className="text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
                  >
                    Close
                  </Button>

                  <div className="flex items-center gap-2">
                    {selectedReport.status !== "published" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedReport.reportId, "published")}
                        disabled={actionLoading}
                        className="bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider gap-1 rounded"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                        Approve for Public Feed
                      </Button>
                    )}

                    {selectedReport.status !== "rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInspectDialogOpen(false);
                          setRejectDialogOpen(true);
                        }}
                        className="text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
                      >
                        Reject / Reason
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </div>
            </div>
          )}
        </Dialog>

        {/* MODAL 2: Rejection Reason Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          {selectedReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <div className="bg-white rounded border border-black max-w-md w-full p-6 space-y-4 text-black">
                <DialogHeader>
                  <DialogTitle className="text-sm font-bold font-mono uppercase tracking-wider text-black">
                    Reject Docket #{selectedReport.reportId}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-600">
                    Provide an audit reason for rejecting this record (e.g. personal doxxing, invalid documentation, or commercial spam).
                  </DialogDescription>
                </DialogHeader>

                <Textarea
                  rows={3}
                  placeholder="Enter reason for audit rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="text-xs bg-white border-black"
                />

                <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRejectDialogOpen(false);
                      setRejectionReason("");
                    }}
                    className="text-xs border-black text-black hover:bg-zinc-100 font-bold uppercase tracking-wider rounded"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedReport.reportId, "rejected", rejectionReason)}
                    disabled={actionLoading}
                    className="text-xs font-bold uppercase tracking-wider bg-black hover:bg-zinc-800 text-white rounded"
                  >
                    Confirm Rejection
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
