import { Department } from "@/lib/models/Department";
import { DepartmentSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { createCrudRoute } from "@/lib/api/crud-handler";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";

const crudHandler = createCrudRoute({
  model: Department,
  schema: DepartmentSchema,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const department = await crudHandler.get(id);
    return NextResponse.json(department);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const body = await request.json();
    const department = await crudHandler.update(id, body);
    return NextResponse.json(department);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    await crudHandler.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
