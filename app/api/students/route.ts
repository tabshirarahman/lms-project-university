import { Student } from "@/lib/models/Student";
import { StudentFormSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/error-handler";
import { requireAdmin } from "@/lib/api/auth-middleware";
import { handleList } from "@/lib/api/list-handler";
import { createStudentWithUser } from "@/lib/services/student.service";
import { connectDB } from "@/lib/db/mongoose";

// export async function GET(request: NextRequest) {
//   await connectDB();
//   try {
   
//     const { searchParams } = new URL(request.url);
//     const query = Object.fromEntries(searchParams);

//     const { data, pagination } = await handleList(query, {
//       model: Student,
//       searchFields: ["name", "roll", "registration"],
//       filterField: "departmentId",
//       populate: ["userId", "departmentId"],
//     });
//     console.log("🚀 ~ GET ~ data:", data)

//     return NextResponse.json({ data, pagination });
//   } catch (error) {
//     return handleApiError(error);
//   }
// }


export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const hasQuery =
      Object.keys(query).length > 0 &&
      (query.page || query.limit || query.search || query.departmentId);

    // ⚡ If no query → return whole collection (NO pagination, NO filters)
    if (!hasQuery) {
      const allData = await Student.find({})

      return NextResponse.json({
        data: allData,
        pagination: {
          total: allData.length,
          page: 1,
          limit: allData.length,
          hasNextPage: false,
        },
      });
    }

    // ⚡ Old logic (handleList) remains fully intact
    const { data, pagination } = await handleList(query, {
      model: Student,
      searchFields: ["name", "roll", "registration"],
      filterField: "departmentId",
      populate: ["userId", "departmentId"],
    });

    return NextResponse.json({ data, pagination });
  } catch (error) {
    return handleApiError(error);
  }
}


export async function POST(request: NextRequest) {
   await connectDB();
  try {
    
    await requireAdmin();
    const body = await request.json();
    const validatedData = StudentFormSchema.parse(body);

    const student = await createStudentWithUser(validatedData);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
