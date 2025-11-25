import { Survey } from "@/lib/models/Survey";
import { SurveyFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { data, pagination } = await handleList(query, {
      model: Survey,
      filterField: "visibility",
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
    const validatedData = SurveyFormSchema.parse(body);

    const survey = new Survey(validatedData);
    await survey.save();

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
