import type { NextRequest } from "next/server";
import { Stakeholder } from "@/lib/models/Stakeholder"; 
import { requireAdmin } from "@/lib/api/auth-middleware";
import { createCrudRoute } from "@/lib/api/crud-handler";
const crud = createCrudRoute({ model: Stakeholder });



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await crud.get(id);
  return Response.json(data);
}


export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await context.params;
  const body = await request.json();

  const updated = await crud.update(id, body);
  return Response.json(updated);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await context.params;

  await crud.delete(id);
  return Response.json({ success: true });
}
