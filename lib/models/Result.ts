import mongoose, { Schema, type Document } from "mongoose"

export interface IResult extends Document {
  _id: string
  studentId: string
  examId: string
  subjects: Array<{
    subjectId: string
    marks: number
    grade: string
  }>
  total: number
  gpa: number
  status: "Pass" | "Fail"
  createdAt: Date
  updatedAt: Date
}

const ResultSchema = new Schema<IResult>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    subjects: [
      {
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        marks: { type: Number },
        grade: { type: String },
      },
    ],
    total: { type: Number },
    gpa: { type: Number },
    status: { type: String, enum: ["Pass", "Fail"] },
  },
  { timestamps: true },
)

export const Result = mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema)
