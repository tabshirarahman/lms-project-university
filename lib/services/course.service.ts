import { connectDB } from "@/lib/db/mongoose";
import { Course } from "@/lib/models/Course";

export async function createCourse(courseData: any) {
  await connectDB();

  const course = new Course(courseData);
  await course.save();
  await course.populate("relatedSubjects");

  return course;
}
