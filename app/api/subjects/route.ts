import { connectDB } from "@/lib/db/mongoose";
import { Subject } from "@/lib/models/Subject";
import { SubjectFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { data, pagination } = await handleList(query, {
      model: Subject,
      populate: "departmentId",
      filterField: "departmentId",
    });

    return NextResponse.json({ data, pagination });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await request.json();
    const validatedData = SubjectFormSchema.parse(body);

    const subject = new Subject(validatedData);
    await subject.save();
    await subject.populate("departmentId");

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
