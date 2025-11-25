import { Student } from "@/lib/models/Student";
import { StudentFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { createCrudRoute } from "@/lib/api/crud-handler";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { connectDB } from "@/lib/db/mongoose";

const crudHandler = createCrudRoute({
  model: Student,
  schema: StudentFormSchema,
  populate: ["userId", "departmentId"],
});

export async function GET(
  
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = params;
    const student = await crudHandler.get(id);
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
   await connectDB();
  try {
    await requireAdmin();
    const { id } = params;
    const body = await request.json();
    const student = await crudHandler.update(id, body);
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
   await connectDB();
  try {
    await requireAdmin();
    const { id } = params;
    await crudHandler.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
