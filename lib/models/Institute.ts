import mongoose, { Schema, type Document } from "mongoose"

export interface IInstitute extends Document {
  _id: string
  name: string
  address: string
  contactInfo: string
  website: string
  createdAt: Date
  updatedAt: Date
}

const InstituteSchema = new Schema<IInstitute>(
  {
    name: { type: String, required: true },
    address: { type: String },
    contactInfo: { type: String },
    website: { type: String },
  },
  { timestamps: true },
)

export const Institute = mongoose.models.Institute || mongoose.model<IInstitute>("Institute", InstituteSchema)
