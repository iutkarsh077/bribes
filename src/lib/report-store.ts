import crypto from "crypto";
import { connectToDatabase } from "./mongodb";
import Report from "@/models/Report";
import { IReport, ReportFilters, ReportStats, ReportStatus } from "@/types/report";

export function generateReportId(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BRB-${suffix}`;
}

export async function createReport(data: {
  imageUrl: string;
  category: string;
  description: string;
  location: { state: string; district: string; area: string };
  ip?: string;
}): Promise<IReport> {
  await connectToDatabase();
  const reportId = generateReportId();
  const ipHash = data.ip ? crypto.createHash("sha256").update(data.ip).digest("hex") : undefined;

  const created = await Report.create({
    reportId,
    imageUrl: data.imageUrl,
    category: data.category,
    description: data.description,
    location: data.location,
    status: "pending",
    ipHash,
  });

  return created.toObject() as IReport;
}

export async function getReports(filters: ReportFilters = {}): Promise<{
  reports: IReport[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Number(filters.limit) || 10);
  const skip = (page - 1) * limit;

  await connectToDatabase();

  const query: any = {};
  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = "published";
  }

  if (filters.state) {
    query["location.state"] = filters.state;
  }
  if (filters.district) {
    query["location.district"] = filters.district;
  }
  if (filters.category && filters.category !== "All") {
    query.category = filters.category;
  }
  if (filters.search) {
    const searchRegex = new RegExp(filters.search.trim(), "i");
    query.$or = [
      { description: searchRegex },
      { "location.area": searchRegex },
      { "location.district": searchRegex },
      { "location.state": searchRegex },
      { category: searchRegex },
      { reportId: searchRegex },
    ];
  }

  const sortOrder: any = filters.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [reports, total] = await Promise.all([
    Report.find(query).sort(sortOrder).skip(skip).limit(limit).lean(),
    Report.countDocuments(query),
  ]);

  return {
    reports: reports as any as IReport[],
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getReportById(reportId: string): Promise<IReport | null> {
  await connectToDatabase();
  const cleanId = reportId.trim().toUpperCase();
  const report = await Report.findOne({ reportId: cleanId }).lean();
  return (report as any as IReport) || null;
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  moderationReason?: string
): Promise<IReport | null> {
  await connectToDatabase();
  const cleanId = reportId.trim().toUpperCase();

  const updated = await Report.findOneAndUpdate(
    { reportId: cleanId },
    { status, moderationReason: moderationReason || "" },
    { new: true }
  ).lean();

  return (updated as any as IReport) || null;
}

export async function getStats(): Promise<ReportStats> {
  await connectToDatabase();

  const [totalSubmitted, totalPublished, statesCovered, districtsCovered] = await Promise.all([
    Report.countDocuments({}),
    Report.countDocuments({ status: "published" }),
    Report.distinct("location.state", { status: "published" }),
    Report.distinct("location.district", { status: "published" }),
  ]);

  return {
    totalSubmitted,
    totalPublished,
    statesCovered: statesCovered.length,
    districtsCovered: districtsCovered.length,
  };
}
