import { connectDB } from "@/lib/db/mongoose";
import { Course } from "@/lib/models/Course"; 
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

// Upload asset to course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdmin();
    const { id } = await params;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(
      file,
      `lms/courses/${id}`
    );

    // Add asset to course
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const asset = {
      name: file.name,
      url,
      publicId,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
    };

    course.assets = course.assets || [];
    course.assets.push(asset);
    await course.save();

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete asset from course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdmin();
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID required" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // Remove asset from course
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    course.assets = course.assets.filter(
      (asset: any) => asset.publicId !== publicId
    );
    await course.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
