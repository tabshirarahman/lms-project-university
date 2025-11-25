import { getSession } from "./session";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "../models/User"; 
import { Student } from "../models/Student";
import type { MergedStudentData } from "@/lib/types";

/**
 * Get merged user and student data for the logged-in student
 * Returns null if not logged in or student record not found
 */
export async function getStudentData(): Promise<MergedStudentData | null> {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return null;
    }

    await connectDB();

    // Fetch user data
    const user = await User.findById(session.userId).lean();
    if (!user) {
      return null;
    }

    // Fetch student data
    const student = await Student.findOne({ userId: session.userId }).lean();
    if (!student) {
      return null;
    }

    // Merge user and student data
    return {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: student.studentId,
      roll: student.roll,
      registration: student.registration,
      departmentId: student.departmentId.toString(),
      subject: student.subject,
      batch: student.batch,
      session: student.session,
      gender: student.gender,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
}

/**
 * Get merged user and student data for the logged-in student
 * Throws error if not logged in or student record not found
 */
export async function requireStudentData(): Promise<MergedStudentData> {
  const data = await getStudentData();

  if (!data) {
    throw new Error("Unauthorized: Student data not found");
  }

  return data;
}
