export type UserRole = "admin" | "student"

export interface AuthSession {
  userId: string
  email: string
  role: UserRole
  name: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
export interface MergedStudentData {
  // User data
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  // Student data
  studentId: string;
  roll: string;
  registration: string;
  departmentId: string;
  subject: string;
  batch: string;
  session: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}
