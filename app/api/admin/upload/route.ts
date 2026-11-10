import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directUrl = formData.get("url") as string | null;

    if (directUrl) {
      // Direct URL provided
      return NextResponse.json({
        success: true,
        url: directUrl,
        publicId: "",
      });
    }

    if (!file) {
      return NextResponse.json(
        { error: "No image file or URL provided" },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary folder "zappmart/products"
    const result = await uploadToCloudinary(base64Data, "zappmart/products");

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("[Cloudinary Upload Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}

