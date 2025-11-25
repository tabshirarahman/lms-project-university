import { connectDB } from "@/lib/db/mongoose";
import { Enrollment } from "@/lib/models/Enrollment";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const enrollment = await Enrollment.findById(id)
      .populate("studentId", "name email")
      .populate("courseId", "title price description")
      .lean();

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[v0] Admin enrollment detail API error:", error);
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
 context: { params: Promise<{ id: string }> }  
) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!["pending", "completed", "failed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
     id,
      {
        status,
        completedAt: status === "completed" ? new Date() : null,
      },
      { new: true }
    )
      .populate("studentId", "name email")
      .populate("courseId", "title price");

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    console.log(
      "[v0] Enrollment status updated:",
      enrollment._id,
      "->",
      status
    );

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[v0] Admin enrollment update API error:", error);
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    console.log("[v0] Enrollment deleted:", enrollment._id);

    return NextResponse.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("[v0] Admin enrollment delete API error:", error);
    return handleApiError(error);
  }
}
