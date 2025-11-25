import { connectDB } from "@/lib/db/mongoose";
import { updateEnrollmentStatus } from "@/lib/services/enrollment.service";
import { handleApiError } from "@/lib/api/error-handler";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateEnrollmentStatus(session.id, "completed", new Date());
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateEnrollmentStatus(session.id, "cancelled");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
