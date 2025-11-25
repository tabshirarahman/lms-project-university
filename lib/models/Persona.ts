import mongoose, { Schema, type Document } from "mongoose"

export interface IPersona extends Document {
  _id: string
  name: string
  description: string
  goals: string
  motivations: string
  painPoints: string
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
}

const PersonaSchema = new Schema<IPersona>(
  {
    name: { type: String, required: true },
    description: { type: String },
    goals: { type: String },
    motivations: { type: String },
    painPoints: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true },
)

export const Persona = mongoose.models.Persona || mongoose.model<IPersona>("Persona", PersonaSchema)
