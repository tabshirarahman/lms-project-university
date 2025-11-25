import mongoose, { Schema, type Document } from "mongoose"

export interface ISurvey extends Document {
  _id: string
  title: string
  description: string
  targetGroup: string
  startDate: Date
  endDate: Date
  visibility: "public" | "internal"
  createdAt: Date
  updatedAt: Date
}

const SurveySchema = new Schema<ISurvey>(
  {
    title: { type: String, required: true },
    description: { type: String },
    targetGroup: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    visibility: { type: String, enum: ["public", "internal"], default: "internal" },
  },
  { timestamps: true },
)

export const Survey = mongoose.models.Survey || mongoose.model<ISurvey>("Survey", SurveySchema)
