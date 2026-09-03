import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function processAndStoreImage(fileBuffer: Buffer, mimeType: string): Promise<string> {
  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error("Image file size exceeds maximum limit of 10MB");
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    throw new Error("Invalid image format. Allowed formats: JPG, PNG, WEBP");
  }

  // Strip EXIF metadata, auto-orient according to original orientation, resize if gigantic, convert to optimized WebP
  const processedBuffer = await sharp(fileBuffer)
    .rotate() // automatically orients and strips EXIF tags (GPS, camera info, timestamps)
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER;

  if (!uploadFolder) {
    throw new Error("CLOUDINARY_UPLOAD_FOLDER is not configured in environment variables.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: uploadFolder,
        format: "webp",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message || "Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(processedBuffer);
  });
}
