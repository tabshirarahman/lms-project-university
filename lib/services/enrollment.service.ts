import { Enrollment } from "../models/Enrollment"; 
import { connectDB } from "@/lib/db/mongoose";

export async function createEnrollment(enrollmentData: any) {
  await connectDB();
  const enrollment = new Enrollment(enrollmentData);
  return await enrollment.save();
}

export async function updateEnrollmentStatus(
  stripeSessionId: string,
  status: string,
  completedAt?: Date
) {
  await connectDB();
  return await Enrollment.findOneAndUpdate(
    { stripeSessionId },
    { status, completedAt: status === "completed" ? completedAt : null },
    { new: true }
  );
}

export async function getEnrollment(stripeSessionId: string) {
  await connectDB();
  return await Enrollment.findOne({ stripeSessionId }).populate(
    "studentId courseId"
  );
}

export async function getStudentEnrollments(studentId: string) {
  await connectDB();
  return await Enrollment.find({ studentId, status: "completed" }).populate(
    "courseId"
  );
}
