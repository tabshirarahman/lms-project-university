import { connectDB } from "@/lib/db/mongoose";
import { Course } from "@/lib/models/Course"; 
import { handleApiError } from "@/lib/api/error-handler";
import { requireAuth } from "@/lib/api/auth-middleware";
import { createEnrollment } from "@/lib/services/enrollment.service";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireStudentId } from "@/lib/auth/get-student-id";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
const studentId = await requireStudentId();
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        "http://localhost:3000"
      }/student/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        "http://localhost:3000"
      }/courses/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
      },
    });

    // Create pending enrollment record
    await createEnrollment({
      studentId,
      courseId,
      stripeSessionId: session.id,
      status: "pending",
      amount: course.price,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
