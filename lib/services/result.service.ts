import { connectDB } from "@/lib/db/mongoose";
import { Result } from "@/lib/models/Result";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0,
};

export function calculateGPA(
  subjects: Array<{ marks: number; grade: string }>
): number {
  if (subjects.length === 0) return 0;
  const totalGradePoints = subjects.reduce(
    (sum, subj) => sum + (GRADE_POINTS[subj.grade] || 0),
    0
  );
  const gpa = totalGradePoints / subjects.length;
  return Math.round(gpa * 100) / 100;
}

export function calculateTotal(subjects: Array<{ marks: number }>): number {
  return subjects.reduce((sum, subj) => sum + subj.marks, 0);
}

export async function createResult(resultData: any) {
  await connectDB();

  const total = calculateTotal(resultData.subjects);
  const gpa = calculateGPA(resultData.subjects);

  const result = new Result({
    ...resultData,
    total,
    gpa,
    status: gpa >= 2.0 ? "Pass" : "Fail",
  });

  await result.save();
  await result.populate(["studentId", "examId", "subjects.subjectId"]);

  return result;
}
