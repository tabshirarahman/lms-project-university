import { SurveyQuestion } from "@/lib/models/SurveyQuestion";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { createCrudRoute } from "@/lib/api/crud-handler";

const crudHandler = createCrudRoute({
  model: SurveyQuestion,
});

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
