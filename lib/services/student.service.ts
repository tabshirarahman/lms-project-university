import { connectDB } from "@/lib/db/mongoose";
import { Student } from "@/lib/models/Student";
import { User } from "@/lib/models/User";
import { hashPassword } from "@/lib/auth/password";
import { ApiError } from "@/lib/api/error-handler";

export async function createStudentWithUser(studentData: any) {
  await connectDB();

  // Check if email already exists
  const existingUser = await User.findOne({
    email: studentData.email.toLowerCase(),
  });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  // Create user
  const user = new User({
    name: studentData.name,
    email: studentData.email.toLowerCase(),
    passwordHash: hashPassword("Student@123"),
    role: "student",
  });
  await user.save();

  // Create student
  const student = new Student({
    ...studentData,
    userId: user._id,
    studentId: `STU${Date.now()}`,
  });
  await student.save();
  await student.populate(["userId", "departmentId"]);

  return student;
}
