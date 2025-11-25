import { connectDB } from "@/lib/db/mongoose";
import { Result } from "@/lib/models/Result";
import { Student } from "@/lib/models/Student";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    // Search by roll or registration number
    const students = await Student.find({
      $or: [
        { roll: new RegExp(query, "i") },
        { registration: new RegExp(query, "i") },
      ],
    });

    const studentIds = students.map((s) => s._id);

    const results = await Result.find({
      $or: [{ studentId: { $in: studentIds } }],
    })
      .populate("studentId")
      .populate("examId")
      .populate("subjects.subjectId")
      .limit(20);

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
