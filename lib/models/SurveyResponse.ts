import mongoose, { Schema, type Document } from "mongoose"

export interface ISurveyResponse extends Document {
  _id: string
  surveyId: string
  userId?: string | null
  answers: Array<{
    questionId: string
    answer: string | number
  }>
  createdAt: Date
  updatedAt: Date
}

const SurveyResponseSchema = new Schema<ISurveyResponse>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId },
        answer: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true },
)

export const SurveyResponse =
  mongoose.models.SurveyResponse || mongoose.model<ISurveyResponse>("SurveyResponse", SurveyResponseSchema)
