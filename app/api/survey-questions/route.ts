import { connectDB } from "@/lib/db/mongoose";
import { SurveyQuestion } from "@/lib/models/SurveyQuestion";
import { SurveyQuestionSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get("surveyId");

    let query = SurveyQuestion.find();

    if (surveyId) {
      query = query.where("surveyId").equals(surveyId);
    }

    const questions = await query.sort({ createdAt: 1 });
    return NextResponse.json(questions);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body)
    const validatedData = SurveyQuestionSchema.parse(body);

    const question = new SurveyQuestion(validatedData);
    await question.save();

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
