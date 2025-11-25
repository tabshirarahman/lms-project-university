import mongoose, { Schema, Types, type Document } from "mongoose"
import "@/lib/models/Subject";


export interface ICourse extends Document {
  _id: Types.ObjectId
  title: string
  description: string
  category: string
  level: string
  mode: "online" | "offline"
  price: number
  status: "draft" | "published" | "archived"
  thumbnail: string
  relatedSubjects: string[]
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    level: { type: String },
    mode: { type: String, enum: ["online", "offline"], default: "online" },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    thumbnail: { type: String },
    relatedSubjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true },
)

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)
