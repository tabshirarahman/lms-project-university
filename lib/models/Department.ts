import mongoose, { Schema, Types, type Document } from "mongoose"

export interface IDepartment extends Document {
  _id: Types.ObjectId
  name: string
  code: string
  description: string
  createdAt: Date
  updatedAt: Date
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true },
)

export const Department = mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema)
