import { User } from "@/lib/models/User";
import { hashPassword, verifyPassword } from "./password";
import type { AuthSession } from "@/lib/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "admin" | "teacher" | "student";
  iat?: number;
  exp?: number;
}


export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "student" = "student"
) {
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const passwordHash = hashPassword(password);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    await newUser.save();

    return {
      success: true,
      data: {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid credentials" };
    }

    const session: AuthSession = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return { success: true, data: session };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}




const JWT_SECRET =
  process.env.JWT_SECRET ||
  "6f9c1bd7e45a0d9c3afeb2bb89d2c179f3d7e26f47cb1ac9f194cc0782ac1d4e";




export function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}
