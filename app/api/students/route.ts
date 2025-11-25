import { Student } from "@/lib/models/Student";
import { StudentFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";
import { createStudentWithUser } from "@/lib/services/student.service";
import { connectDB } from "@/lib/db/mongoose";

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { data, pagination } = await handleList(query, {
      model: Student,
      searchFields: ["name", "roll", "registration"],
      filterField: "departmentId",
      populate: ["userId", "departmentId"],
    });
    console.log("🚀 ~ GET ~ data:", data)

    return NextResponse.json({ data, pagination });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
   await connectDB();
  try {
    
    await requireAdmin();
    const body = await request.json();
    const validatedData = StudentFormSchema.parse(body);

    const student = await createStudentWithUser(validatedData);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
