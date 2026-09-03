import { NextRequest, NextResponse } from "next/server";
import { getReportById } from "@/lib/report-store";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await context.params;
    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const report = await getReportById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("Error fetching report by ID:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
