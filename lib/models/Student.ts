import mongoose, { Schema, Types, type Document } from "mongoose"

export interface IStudent extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  studentId: string;
  roll: string;
  registration: string;
  departmentId: Types.ObjectId;
  subject: string;
  batch: string;
  session: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: String, required: true, unique: true },
    roll: { type: String, required: true },
    registration: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    subject: { type: String, required: true },
    batch: { type: String, required: true },
    session: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { timestamps: true },
)

export const Student = mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema)
