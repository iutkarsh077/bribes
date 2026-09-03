import { NextResponse } from "next/server";
import { getStats } from "@/lib/report-store";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform statistics" },
      { status: 500 }
    );
  }
}
