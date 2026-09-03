import { z } from "zod";
import { INCIDENT_CATEGORIES } from "@/types/report";

// Regex patterns to detect sensitive personal identifiers
const PHONE_REGEX = /\b(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}\b/;
const AADHAAR_REGEX = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const reportSubmissionSchema = z.object({
  imageUrl: z.string().min(1, "Evidence photo is required"),
  category: z.enum(INCIDENT_CATEGORIES as [string, ...string[]], {
    message: "Please select a valid category",
  }),
  state: z.string().min(2, "State is required").max(100),
  district: z.string().min(2, "District is required").max(100),
  area: z.string().min(2, "Area / Locality is required").max(150),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .default("")
    .refine((val) => !PHONE_REGEX.test(val), {
      message: "Please do not include personal phone numbers in the report description.",
    })
    .refine((val) => !AADHAAR_REGEX.test(val), {
      message: "Please do not include Aadhaar or government identification numbers.",
    })
    .refine((val) => !EMAIL_REGEX.test(val), {
      message: "Please do not include private personal email addresses.",
    }),
});

export type ReportSubmissionInput = z.infer<typeof reportSubmissionSchema>;

export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // strip HTML tags
    .trim();
}
