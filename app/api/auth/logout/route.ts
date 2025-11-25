import { type NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/api/error-handler"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" })
    response.cookies.set("session", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
