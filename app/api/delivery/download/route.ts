import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { verifyDownloadToken } from "@/lib/download-token";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "A valid, cryptographically signed download token is required to access the bundle."
      },
      { status: 401 }
    );
  }

  const verification = verifyDownloadToken(token);
  if (!verification.valid) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: verification.error || "The download token could not be verified."
      },
      { status: 403 }
    );
  }

  // Look for the genuine product ZIP in multiple robust locations
  const candidatePaths = [
    path.join(process.cwd(), "private", "AI-Agency-Mastery-Vertex-Digitals.zip"),
    path.join(process.cwd(), "private", "vertex_ai_agency_mastery.zip"),
    "/Users/afnankhan/Downloads/vertex_ai_agency_mastery.zip"
  ];

  let resolvedPath: string | null = null;
  for (const candidate of candidatePaths) {
    try {
      if (fs.existsSync(candidate)) {
        resolvedPath = candidate;
        break;
      }
    } catch {
      // Continue check
    }
  }

  if (!resolvedPath) {
    console.error("Product ZIP file not found on disk:", candidatePaths);
    return NextResponse.json(
      {
        error: "Asset Not Found",
        message: "The product bundle ZIP is temporarily unavailable. Please contact support@vertexdigitals.com with your order ID."
      },
      { status: 500 }
    );
  }

  try {
    const fileStat = fs.statSync(resolvedPath);
    const fileStream = fs.createReadStream(resolvedPath);

    // Convert Node ReadStream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      }
    });

    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", 'attachment; filename="AI-Agency-Mastery-Vertex-Digitals.zip"');
    headers.set("Content-Length", String(fileStat.size));
    headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
    headers.set("X-Delivery-Order-ID", verification.orderId || "verified");
    headers.set("X-Delivery-Status", "authorized");

    return new NextResponse(readableStream, {
      status: 200,
      headers
    });
  } catch (err) {
    console.error("Error streaming product ZIP file:", err);
    return NextResponse.json(
      {
        error: "Delivery Error",
        message: "Failed to stream the ZIP archive. Please retry the download link."
      },
      { status: 500 }
    );
  }
}
