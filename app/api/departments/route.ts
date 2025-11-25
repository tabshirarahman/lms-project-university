import { connectDB } from "@/lib/db/mongoose";
import { Department } from "@/lib/models/Department";
import { DepartmentSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const departments = await Department.find().sort({ createdAt: -1 });
    return NextResponse.json(departments);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await request.json();
    const validatedData = DepartmentSchema.parse(body);

    const department = new Department(validatedData);
    await department.save();

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
