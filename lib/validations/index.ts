import { z } from "zod";

// User schemas
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "student"]).default("student"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Student schemas
export const StudentFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  roll: z.string().min(1, "Roll number is required"),
  registration: z.string().min(1, "Registration number is required"),
  departmentId: z.string().min(1, "Department is required"),
  subject: z.string().min(1, "Subject is required"),
  batch: z.string().min(1, "Batch is required"),
  session: z.string().min(1, "Session is required"),
  gender: z.enum(["Male", "Female", "Other"]),
});

// Department schemas
export const DepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required"),
  description: z.string().optional(),
});

// Subject schemas
export const SubjectFormSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  credit: z.number().min(1, "Credit hours must be at least 1"),
  departmentId: z.string().min(1, "Department is required"),
});

// Course schemas
export const CourseFormSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  mode: z.enum(["online", "offline"]),
  price: z.number(),
  status: z.enum(["draft", "published", "archived"]),
  relatedSubjects: z.array(z.string()).optional(),
});

// Result schemas
export const ResultFormSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  examId: z.string().min(1, "Exam is required"),
  subjects: z.array(
    z.object({
      subjectId: z.string(),
      marks: z.number().min(0),
      grade: z.string(),
    })
  ),
});

// Survey schemas
export const SurveyFormSchema = z.object({
  title: z.string().min(1, "Survey title is required"),
  description: z.string().optional(),
  targetGroup: z.string().optional(),
  startDate: z.string().optional(), 
  endDate: z.string().optional(),
  visibility: z.enum(["public", "internal"]),
});


export const SurveyQuestionSchema = z.object({
  surveyId: z.string().min(1, "Survey ID is required"),
  type: z.enum(["mcq", "rating", "text"]),
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).optional(),
});

export const SurveyResponseSchema = z.object({
  surveyId: z.string().min(1, "Survey is required"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.union([z.string(), z.number()]),
    })
  ),
});

// Exam schemas
export const ExamFormSchema = z.object({
  examName: z.string().min(1, "Exam name is required"),
  year: z.number().min(2000, "Year must be valid"),
  session: z.string().min(1, "Session is required"),
  type: z.string().optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type StudentFormInput = z.infer<typeof StudentFormSchema>;
export type DepartmentInput = z.infer<typeof DepartmentSchema>;
export type SubjectFormInput = z.infer<typeof SubjectFormSchema>;
export type CourseFormInput = z.infer<typeof CourseFormSchema>;
export type ResultFormInput = z.infer<typeof ResultFormSchema>;
export type SurveyFormInput = z.infer<typeof SurveyFormSchema>;
export type SurveyResponseInput = z.infer<typeof SurveyResponseSchema>;
export type ExamFormInput = z.infer<typeof ExamFormSchema>;
