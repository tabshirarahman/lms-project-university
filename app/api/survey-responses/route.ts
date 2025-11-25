import { connectDB } from "@/lib/db/mongoose";
import { SurveyResponse } from "@/lib/models/SurveyResponse";
import { SurveyResponseSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const validatedData = SurveyResponseSchema.parse(body);

    const response = new SurveyResponse(validatedData);
    await response.save();

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
