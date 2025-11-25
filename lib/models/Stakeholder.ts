import mongoose, { Schema, Types, type Document } from "mongoose"

export interface IStakeholder extends Document {
  _id: Types.ObjectId
  name: string
  type: "Student" | "Admin" 
  responsibilities: string
  contactInfo: string
  createdAt: Date
  updatedAt: Date
}

const StakeholderSchema = new Schema<IStakeholder>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Student","Admin"],
      required: true,
    },
    responsibilities: { type: String },
    contactInfo: { type: String },
  },
  { timestamps: true },
)

export const Stakeholder = mongoose.models.Stakeholder || mongoose.model<IStakeholder>("Stakeholder", StakeholderSchema)
