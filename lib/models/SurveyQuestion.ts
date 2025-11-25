import mongoose, { Schema, type Document } from "mongoose"

export interface ISurveyQuestion extends Document {
  _id: string
  surveyId: string
  type: "mcq" | "rating" | "text"
  questionText: string
  options: string[]
  createdAt: Date
  updatedAt: Date
}

const SurveyQuestionSchema = new Schema<ISurveyQuestion>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
    type: { type: String, enum: ["mcq", "rating", "text"], required: true },
    questionText: { type: String, required: true },
    options: [{ type: String }],
  },
  { timestamps: true },
)

export const SurveyQuestion =
  mongoose.models.SurveyQuestion || mongoose.model<ISurveyQuestion>("SurveyQuestion", SurveyQuestionSchema)
