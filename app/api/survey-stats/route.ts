import { connectDB } from "@/lib/db/mongoose";
import { SurveyResponse } from "@/lib/models/SurveyResponse"; 
import { Survey } from "@/lib/models/Survey"; 
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalResponses = await SurveyResponse.countDocuments();
    const publicSurveys = await Survey.find({ visibility: "public" });

    let satisfactionScore = 0;
    let ratingCount = 0;

    for (const survey of publicSurveys) {
      const responses = await SurveyResponse.find({ surveyId: survey._id });
      responses.forEach((resp) => {
        resp.answers.forEach((answer: any) => {
          if (
            typeof answer.answer === "number" &&
            answer.answer >= 1 &&
            answer.answer <= 5
          ) {
            satisfactionScore += answer.answer;
            ratingCount++;
          }
        });
      });
    }

    const avgSatisfaction =
      ratingCount > 0
        ? Math.round((satisfactionScore / (ratingCount * 5)) * 100)
        : 0;

    return NextResponse.json({
      totalResponses,
      satisfactionScore: avgSatisfaction,
      publicSurveysCount: publicSurveys.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
