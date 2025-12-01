import { NextRequest, NextResponse } from "next/server";
import { Enrollment } from "@/lib/models/Enrollment"; 
import { connectDB } from "@/lib/db/mongoose";
import "@/lib/models/Course";
import "@/lib/models/Student";


export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    await connectDB();

    const enrollment = await Enrollment.findOne({ courseId: id })
      .populate("courseId")
      .populate("studentId");
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    //    const enrollment = await Enrollment.findOne({ courseId: id });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error(" Enrollment fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollment" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await request.json();

    const enrollment = await Enrollment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[v0] Enrollment update error:", error);
    return NextResponse.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}
