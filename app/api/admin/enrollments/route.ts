import { connectDB } from "@/lib/db/mongoose";
import { Enrollment } from "@/lib/models/Enrollment";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      Enrollment.find(query)
        .populate("studentId", "name email")
        .populate("courseId", "title price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enrollment.countDocuments(query),
    ]);

    return NextResponse.json({
      data: enrollments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[v0] Admin enrollments API error:", error);
    return handleApiError(error);
  }
}
