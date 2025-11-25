import mongoose, { Schema, Types, type Document } from "mongoose"

export interface ISubject extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  credit: number;
  departmentId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credit: { type: Number, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  },
  { timestamps: true },
)

export const Subject = mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema)
