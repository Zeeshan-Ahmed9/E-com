import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Server-side helper to upload an image buffer or base64 string to Cloudinary
 */
export async function uploadToCloudinary(
  fileBase64: string,
  folder: string = "2s-store/products"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder,
    transformation: [
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Server-side helper to delete an image asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

