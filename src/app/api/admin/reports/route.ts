import { NextRequest, NextResponse } from "next/server";
import { getReports, getStats } from "@/lib/report-store";
import { ReportStatus } from "@/types/report";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") as ReportStatus | undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const [reportsResult, stats] = await Promise.all([
      getReports({
        status: statusParam || undefined,
        search,
        page,
        limit,
        sort: "newest",
      }),
      getStats(),
    ]);

    return NextResponse.json({
      ...reportsResult,
      stats,
    });
  } catch (error) {
    console.error("Admin fetch reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports for administration" },
      { status: 500 }
    );
  }
}
