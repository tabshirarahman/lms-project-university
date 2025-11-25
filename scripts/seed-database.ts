import { connectDB } from "../lib/db/mongoose";
import { User } from "../lib/models/User";
import { Student } from "../lib/models/Student";
import { Department } from "../lib/models/Department";
import { Subject } from "../lib/models/Subject";
import { Course } from "../lib/models/Course";
import { hashPassword } from "../lib/auth/password";

async function seedDatabase() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Course.deleteMany({});
    console.log("Cleared existing data");

    // Create departments
    const csDept = await Department.create({
      name: "Computer Science",
      code: "CS",
      description: "Department of Computer Science and Engineering",
    });

    const itDept = await Department.create({
      name: "Information Technology",
      code: "IT",
      description: "Department of Information Technology",
    });

    console.log("Created departments");

    // Create subjects
    const dataStructures = await Subject.create({
      name: "Data Structures",
      code: "DS101",
      credit: 3,
      departmentId: csDept._id,
    });

    const webDev = await Subject.create({
      name: "Web Development",
      code: "WD201",
      credit: 3,
      departmentId: itDept._id,
    });

    const database = await Subject.create({
      name: "Database Management",
      code: "DB101",
      credit: 3,
      departmentId: csDept._id,
    });

    console.log("Created subjects");

    // Create courses
    await Course.create({
      title: "Full Stack Web Development",
      description: "Learn MERN stack development",
      category: "Web Development",
      level: "Beginner",
      mode: "online",
      price: 9999,
      status: "published",
      relatedSubjects: [webDev._id],
    });

    await Course.create({
      title: "Data Structures & Algorithms",
      description: "Master DSA for interviews",
      category: "Programming",
      level: "Intermediate",
      mode: "online",
      price: 4999,
      status: "published",
      relatedSubjects: [dataStructures._id],
    });

    console.log("Created courses");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: hashPassword("Admin@123"),
      role: "admin",
    });

    console.log("Created admin user");

    // Create student users and students
    const studentUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: hashPassword("Student@123"),
      role: "student",
    });

    await Student.create({
      name: "John Doe",
      email: "john@example.com",
      roll: "001",
      registration: "REG001",
      departmentId: csDept._id,
      userId: studentUser._id,
      studentId: `STU${Date.now()}`,
      subject: "CS",
      batch: "2023",
      session: "Spring 2024",
      gender: "Male",
    });

    const studentUser2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      passwordHash: hashPassword("Student@123"),
      role: "student",
    });

    await Student.create({
      name: "Jane Smith",
      email: "jane@example.com",
      roll: "002",
      registration: "REG002",
      departmentId: itDept._id,
      userId: studentUser2._id,
      studentId: `STU${Date.now()}`,
      subject: "IT",
      batch: "2023",
      session: "Spring 2024",
      gender: "Female",
    });

    console.log("Created student users and students");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDemo Credentials:");
    console.log("Admin Email: admin@example.com");
    console.log("Admin Password: Admin@123");
    console.log("Student Email: john@example.com");
    console.log("Student Password: Student@123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
