import { Survey } from "@/lib/models/Survey";
import { SurveyFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { createCrudRoute } from "@/lib/api/crud-handler";

const crudHandler = createCrudRoute({
  model: Survey,
  schema: SurveyFormSchema,
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const survey = await crudHandler.get(id);
    return NextResponse.json(survey);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const survey = await crudHandler.update(id, body);
    return NextResponse.json(survey);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await crudHandler.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
