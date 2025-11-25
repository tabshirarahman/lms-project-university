import { Result } from "@/lib/models/Result";
import { ResultFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";
import { createResult } from "@/lib/services/result.service";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { data, pagination } = await handleList(query, {
      model: Result,
      populate: ["studentId", "examId", "subjects.subjectId"],
      filterField: "studentId",
    });

    return NextResponse.json({ data, pagination });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validatedData = ResultFormSchema.parse(body);

    const result = await createResult(validatedData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
