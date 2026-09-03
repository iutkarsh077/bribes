export type IncidentCategory =
  | "Road & Infrastructure"
  | "Education"
  | "School"
  | "Hospital & Healthcare"
  | "Police"
  | "Municipal Services"
  | "Government Office"
  | "License / Certificate"
  | "Land / Property"
  | "Other";

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  "Road & Infrastructure",
  "Education",
  "School",
  "Hospital & Healthcare",
  "Police",
  "Municipal Services",
  "Government Office",
  "License / Certificate",
  "Land / Property",
  "Other",
];

export type ReportStatus = "pending" | "published" | "rejected" | "removed";

export interface ReportLocation {
  state: string;
  district: string;
  area: string;
}

export interface IReport {
  _id?: string;
  reportId: string;
  imageUrl: string;
  category: IncidentCategory;
  description: string;
  location: ReportLocation;
  status: ReportStatus;
  moderationReason?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ReportStats {
  totalSubmitted: number;
  totalPublished: number;
  statesCovered: number;
  districtsCovered: number;
}

export interface ReportFilters {
  search?: string;
  state?: string;
  district?: string;
  category?: string;
  status?: ReportStatus;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}
