import { connectDB } from "@/lib/db/mongoose";
import { Exam } from "@/lib/models/Exam";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleApiError } from "@/lib/api/error-handler";
import { ExamFormSchema } from "@/lib/validations";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const exam = await Exam.findById(id);
    if (!exam) {
      return Response.json({ error: "Exam not found" }, { status: 404 });
    }

    return Response.json(exam);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth) return auth;

    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const validatedData = ExamFormSchema.parse(body);

    const exam = await Exam.findByIdAndUpdate(id, validatedData, { new: true });
    if (!exam) {
      return Response.json({ error: "Exam not found" }, { status: 404 });
    }

    return Response.json(exam);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth) return auth;

    await connectDB();
    const { id } = await params;

    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return Response.json({ error: "Exam not found" }, { status: 404 });
    }

    return Response.json({ message: "Exam deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
