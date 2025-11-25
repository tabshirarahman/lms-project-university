"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EnrollmentButtonProps {
  courseId: string;
  price: number;
  studentId: string;
}

export function EnrollmentButton({ courseId, price , studentId}: EnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, userId:studentId }),
      });

      // ❗ Must parse only ONCE
      const data = await response.json();
      console.log("Checkout response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe checkout
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to proceed with enrollment");
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleEnroll} disabled={isLoading} className="w-full">
      {isLoading ? "Processing..." : `Enroll for $${price}`}
    </Button>
  );
}
