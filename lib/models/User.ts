import mongoose, { Schema, Types, type Document } from "mongoose"

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "student";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "student"], default: "student" },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
