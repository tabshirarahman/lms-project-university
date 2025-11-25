import { Subject } from "@/lib/models/Subject";
import { SubjectFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { createCrudRoute } from "@/lib/api/crud-handler";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";

const crudHandler = createCrudRoute({
  model: Subject,
  schema: SubjectFormSchema,
  populate: "departmentId",
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const subject = await crudHandler.get(id);
    return NextResponse.json(subject);
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
    const subject = await crudHandler.update(id, body);
    return NextResponse.json(subject);
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
