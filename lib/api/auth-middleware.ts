// import { getSession } from "@/lib/auth/session"
// import { ApiError } from "./error-handler"
// import type { AuthSession } from "@/lib/types"

// export async function requireAuth(): Promise<AuthSession> {
//   const session = await getSession()

//   if (!session) {
//     throw new ApiError(401, "Unauthorized: Please log in")
//   }

//   return session
// }

// export async function requireRole(role: "admin" | "student"): Promise<AuthSession> {
//   const session = await requireAuth()

//   if (session.role !== role) {
//     throw new ApiError(403, `Forbidden: This action requires ${role} role`)
//   }

//   return session
// }

// export async function requireAdmin(): Promise<AuthSession> {
//   return requireRole("admin")
// }



import { getSession } from "@/lib/auth/session"
import { ApiError } from "./error-handler"
import type { JWTPayload } from "@/lib/auth/auth"


export type AuthContext = JWTPayload

export async function requireAuth(): Promise<AuthContext> {
  const session = await getSession()

  if (!session) {
    throw new ApiError(401, "Unauthorized: Please log in")
  }

  return session
}

export async function requireRole(
  role: JWTPayload["role"] // "admin" | "student"
): Promise<AuthContext> {
  const session = await requireAuth()

  if (session.role !== role) {
    throw new ApiError(403, `Forbidden: This action requires ${role} role`)
  }

  return session
}

export async function requireAdmin(): Promise<AuthContext> {
  return requireRole("admin")
}
export async function requireStudent(): Promise<AuthContext> {
  return requireRole("student")
}
