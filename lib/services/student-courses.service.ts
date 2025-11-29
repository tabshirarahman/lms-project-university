import { connectDB } from "@/lib/db/mongoose";
import { Enrollment } from "../models/Enrollment"; 

export interface StudentCourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  thumbnail?: string;
  enrolledAt: Date;
  status: string;
}

/**
 * Get all courses that a student has successfully purchased/enrolled in
 * @param studentId - The ID of the student
 * @returns Array of courses with enrollment information
 */
export async function getStudentEnrolledCourses(
  studentId: string
): Promise<StudentCourse[]> {
  await connectDB();

  const enrollments = await Enrollment.find({
    studentId
  })
    .populate("courseId")
    .sort({ enrolledAt: -1 }) // Most recent first
    .lean();

  return enrollments.map((enrollment: any) => ({
    _id: enrollment.courseId._id.toString(),
    title: enrollment.courseId.title,
    description: enrollment.courseId.description,
    price: enrollment.amount,
    instructor: enrollment.courseId.instructor,
    duration: enrollment.courseId.duration,
    level: enrollment.courseId.level,
    category: enrollment.courseId.category,
    thumbnail: enrollment.courseId.thumbnail,
    enrolledAt: enrollment.enrolledAt,
    status: enrollment.status,
  }));
}

/**
 * Get count of enrolled courses for a student
 * @param studentId - The ID of the student
 * @returns Number of completed enrollments
 */
export async function getStudentEnrolledCoursesCount(
  studentId: string
): Promise<number> {
  await connectDB();

  return await Enrollment.countDocuments({
    studentId,
    status: "completed",
  });
}

/**
 * Check if a student is enrolled in a specific course
 * @param studentId - The ID of the student
 * @param courseId - The ID of the course
 * @returns Boolean indicating enrollment status
 */
export async function isStudentEnrolledInCourse(
  studentId: string,
  courseId: string
): Promise<boolean> {
  await connectDB();

  const enrollment = await Enrollment.findOne({
    studentId,
    courseId,
    status: "completed",
  });

  return !!enrollment;
}
