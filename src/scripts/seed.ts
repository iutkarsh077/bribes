import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";
import { IReport } from "../types/report";
import DbConnect from "../lib/mongodb";

loadEnvConfig(process.cwd());

const SEED_REPORTS: IReport[] = [
  {
    reportId: "BRB-8F42K",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
    category: "Road & Infrastructure",
    description: "Contractor asked for an unauthorized payment of 10,000 INR to resume overdue road patching work in residential sector.",
    location: {
      state: "Punjab",
      district: "Ludhiana",
      area: "Model Town"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    reportId: "BRB-3M99P",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    category: "Government Office",
    description: "Clerk insisted on cash bribe to hand over officially sanctioned property verification certificates.",
    location: {
      state: "Maharashtra",
      district: "Pune",
      area: "Shivaji Nagar"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    reportId: "BRB-7X21R",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    category: "Hospital & Healthcare",
    description: "Desk assistant demanded illegal cash payment before releasing free government scan appointment date.",
    location: {
      state: "Karnataka",
      district: "Bengaluru Urban",
      area: "Jayanagar"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    reportId: "BRB-4K11T",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    category: "Police",
    description: "Desk officer refused to issue document receipt for lost driving license without unauthorized service fee.",
    location: {
      state: "Delhi",
      district: "South Delhi",
      area: "Hauz Khas"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    reportId: "BRB-9Q55V",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    category: "Municipal Services",
    description: "Sanitation coordinator demanded monthly collection payment to send waste management truck on public street.",
    location: {
      state: "Rajasthan",
      district: "Jaipur",
      area: "Vaishali Nagar"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    reportId: "BRB-2C44L",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    category: "Education",
    description: "Clerk demanded illegal paperwork processing fee for school transfer certificate that is legally free.",
    location: {
      state: "Uttar Pradesh",
      district: "Lucknow",
      area: "Alambagh"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    reportId: "BRB-6W33Z",
    imageUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
    category: "License / Certificate",
    description: "Driving test assistant claimed slot was full unless candidate paid extra unofficial speed money.",
    location: {
      state: "Tamil Nadu",
      district: "Chennai",
      area: "Anna Nagar"
    },
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    reportId: "BRB-1A88Y",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    category: "Land / Property",
    description: "Revenue office surveyor postponed field measurement by 3 months waiting for unofficial settlement fee.",
    location: {
      state: "Gujarat",
      district: "Ahmedabad",
      area: "Navrangpura"
    },
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  }
];

async function seed() {
  console.log("🌱 Seeding JanSeva Bribe Reporting Database...");

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is missing in .env");
  }

  await DbConnect();

  const ReportSchema = new mongoose.Schema({
    reportId: { type: String, unique: true },
    imageUrl: String,
    category: String,
    description: String,
    location: { state: String, district: String, area: String },
    status: String,
    moderationReason: String,
  }, { timestamps: true });

  const ReportModel = mongoose.models.Report || mongoose.model("Report", ReportSchema);

  for (const report of SEED_REPORTS) {
    await ReportModel.updateOne(
      { reportId: report.reportId },
      { $set: report },
      { upsert: true }
    );
  }

  console.log(`✅ Seeded ${SEED_REPORTS.length} reports into MongoDB collection.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
