import { connectDB } from "@/lib/db/mongoose";
import { Enrollment } from "@/lib/models/Enrollment"; 
import { handleApiError } from "@/lib/api/error-handler";
import { requireAuth } from "@/lib/api/auth-middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      );
    }

    const enrollments = await Enrollment.find({
      studentId
    }).populate("courseId");

    return NextResponse.json(enrollments);
  } catch (error) {
    return handleApiError(error);
  }
}
