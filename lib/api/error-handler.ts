import { NextResponse } from "next/server"
import { ZodError } from "zod"

export interface ApiErrorResponse {
  error: string
  details?: Record<string, string[]>
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error("[API Error]", error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof ZodError) {
    const fieldErrors = error.flatten().fieldErrors
    return NextResponse.json(
      {
        error: "Validation failed",
        details: fieldErrors as Record<string, string[]>,
      },
      { status: 400 },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
