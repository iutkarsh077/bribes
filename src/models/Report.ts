import mongoose, { Schema, Document, Model } from "mongoose";
import { IReport } from "@/types/report";

export interface IReportDocument extends Omit<IReport, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

const ReportSchema = new Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
      trim: true,
    },
    location: {
      state: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
      district: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "published", "rejected", "removed"],
      default: "pending",
      index: true,
    },
    moderationReason: {
      type: String,
      default: "",
      trim: true,
    },
    ipHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast multi-field search and feed ordering
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ status: 1, "location.state": 1, "location.district": 1 });
ReportSchema.index({ status: 1, category: 1 });

export const Report =
  (mongoose.models.Report as Model<any>) || mongoose.model("Report", ReportSchema);

export default Report;
