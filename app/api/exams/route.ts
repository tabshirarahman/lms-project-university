import { connectDB } from "@/lib/db/mongoose";
import { Exam } from "@/lib/models/Exam"; 
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleApiError } from "@/lib/api/error-handler";
import { ExamFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [exams, total] = await Promise.all([
      Exam.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Exam.countDocuments(),
    ]);

    return Response.json({
      exams,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth) return auth;

    await connectDB();

    const body = await request.json();
    const validatedData = ExamFormSchema.parse(body);

    const exam = await Exam.create(validatedData);

    return Response.json(exam, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
