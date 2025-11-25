import type { NextRequest } from "next/server";
import { Stakeholder } from "@/lib/models/Stakeholder";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";
import { connectDB } from "@/lib/db/mongoose";

export async function GET(request: NextRequest) {
      await connectDB();
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

    const result = await handleList(query, {
      
    model: Stakeholder,
    searchFields: ["name", "email", "role"],
    filterField: "status",
  });

  return Response.json(result);
}

export async function POST(request: NextRequest) {
    await connectDB();
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

    try {
         
    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body)

    const stakeholder = new Stakeholder(body);
    await stakeholder.save();

    return Response.json(stakeholder, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
