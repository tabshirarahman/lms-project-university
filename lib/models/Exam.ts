import mongoose, { Schema, Types, type Document } from "mongoose";

export interface IExam extends Document {
  _id: Types.ObjectId;
  examName: string;
  year: number;
  session: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    examName: { type: String, required: true },
    year: { type: Number, required: true },
    session: { type: String, required: true },
    type: { type: String },
  },
  { timestamps: true }
);

export const Exam =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
