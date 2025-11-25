import { requireAuth } from "@/lib/api/auth-middleware";

export async function GET() {
  const session = await requireAuth();
  return Response.json(session);
}
