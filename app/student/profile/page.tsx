import { redirect } from "next/navigation";
import { getStudentData } from "@/lib/auth/get-student-data";
import { connectDB } from "@/lib/db/mongoose";
import { Department } from "@/lib/models/Department";
import ProfileClient from "./profile-client";

export default async function StudentProfilePage() {
  const student = await getStudentData();
  if (!student) redirect("/login");

  await connectDB();
  const department = await Department.findById(student.departmentId).lean();

  return (
    <ProfileClient
      student={{
        ...student,
        departmentName: department?.name || "N/A",
      }}
    />
  );
}
