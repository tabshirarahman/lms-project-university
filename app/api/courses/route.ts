import { connectDB } from "@/lib/db/mongoose";
import { Course } from "@/lib/models/Course";
import { CourseFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";
import { createCourse } from "@/lib/services/course.service";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { data, pagination } = await handleList(query, {
      model: Course,
      populate: "relatedSubjects",
      filterField: "status",
    });

    return NextResponse.json({ data, pagination });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdmin();
    const body = await request.json();
    const validatedData = CourseFormSchema.parse(body);

    const course = await createCourse(validatedData);
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
