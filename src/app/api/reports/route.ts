import { NextRequest, NextResponse } from "next/server";
import { getReports, createReport } from "@/lib/report-store";
import { reportSubmissionSchema, sanitizeText } from "@/lib/validation";

// Simple in-memory rate limiter for anonymous submissions: max 5 submissions per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const state = searchParams.get("state") || undefined;
    const district = searchParams.get("district") || undefined;
    const sort = (searchParams.get("sort") as "newest" | "oldest") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    const result = await getReports({
      search,
      category,
      state,
      district,
      sort,
      page,
      limit,
      status: "published",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait 10 minutes before submitting another report." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = reportSubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues?.[0]?.message || "Invalid report input";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    const report = await createReport({
      imageUrl: data.imageUrl,
      category: data.category,
      description: sanitizeText(data.description || ""),
      location: {
        state: sanitizeText(data.state),
        district: sanitizeText(data.district),
        area: sanitizeText(data.area),
      },
      ip,
    });

    return NextResponse.json(
      {
        success: true,
        reportId: report.reportId,
        status: report.status,
        createdAt: report.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}
