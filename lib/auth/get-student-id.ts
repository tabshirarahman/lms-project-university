import { getSession } from "@/lib/auth/session";

/**
 * Get the current logged-in student's ID from session
 * @returns Student ID (userId from session) or null if not authenticated
 * @example
 * ```typescript
 * const studentId = await getStudentId()
 * if (!studentId) {
 *   return { error: "Unauthorized" }
 * }
 * ```
 */
export async function getStudentId(): Promise<string | null> {
  const session = await getSession();
  console.log("🚀 ~ getStudentId ~ session:", session)

  if (!session || !session.userId) {
    return null;
  }

  return session.userId;
}

/**
 * Get the current logged-in student's ID, throwing an error if not authenticated
 * @throws Error if user is not authenticated
 * @returns Student ID (userId from session)
 * @example
 * ```typescript
 * try {
 *   const studentId = await requireStudentId()
 *   // Use studentId safely
 * } catch (error) {
 *   return { error: "Unauthorized" }
 * }
 * ```
 */
export async function requireStudentId(): Promise<string> {
  const studentId = await getStudentId();

  if (!studentId) {
    throw new Error("Unauthorized: Student ID not found in session");
  }

  return studentId;
}
