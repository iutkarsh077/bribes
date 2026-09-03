import { NextRequest, NextResponse } from "next/server";
import { updateReportStatus } from "@/lib/report-store";
import { ReportStatus } from "@/types/report";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reportId: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { reportId } = await context.params;
    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const { status, moderationReason } = await request.json();

    const validStatuses: ReportStatus[] = ["pending", "published", "rejected", "removed"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateReportStatus(reportId, status, moderationReason);
    if (!updated) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    console.error("Admin update report error:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
