import { connectDB } from "@/lib/db/mongoose"
import { registerUser } from "@/lib/auth/auth"
import { RegisterSchema } from "@/lib/validations"
import { type NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/api/error-handler"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validatedData = RegisterSchema.parse(body)

    const result = await registerUser(
      validatedData.name,
      validatedData.email,
      validatedData.password,
      validatedData.role,
    )

    if (!result.success) {
      return handleApiError(new Error(result.error))
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
