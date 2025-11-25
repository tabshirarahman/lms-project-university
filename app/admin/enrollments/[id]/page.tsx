"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function EnrollmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEnrollment();
  }, [params.id]);

  const fetchEnrollment = async () => {
    try {
      const response = await fetch(`/api/admin/enrollments/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setEnrollment(data);
    } catch (error) {
      alert("Failed to load enrollment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/enrollments/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");

      await fetchEnrollment();
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!enrollment) {
    return <div className="text-center py-8">Enrollment not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Enrollment Details
          </h1>
          <p className="text-muted-foreground">
            View and manage enrollment information
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Student Information
          </h2>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-foreground">
                {enrollment.studentId?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-foreground">
                {enrollment.studentId?.email || "N/A"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Course Information
          </h2>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Course Title
              </label>
              <p className="text-foreground">
                {enrollment.courseId?.title || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Price
              </label>
              <p className="text-foreground">
                ${enrollment.courseId?.price || enrollment.amount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Payment & Status
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Amount Paid
            </label>
            <p className="text-2xl font-bold text-foreground">
              ${enrollment.amount}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Status
            </label>
            <Select
              value={enrollment.status}
              onValueChange={handleStatusChange}
              disabled={isSaving}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      statusColors[
                        enrollment.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Stripe Session ID
            </label>
            <p className="text-sm text-foreground font-mono break-all">
              {enrollment.stripeSessionId}
            </p>
          </div>
          {enrollment.stripePaymentIntentId && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Stripe Payment Intent
              </label>
              <p className="text-sm text-foreground font-mono break-all">
                {enrollment.stripePaymentIntentId}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Enrolled Date
            </label>
            <p className="text-foreground">
              {new Date(enrollment.enrolledAt).toLocaleString()}
            </p>
          </div>
          {enrollment.completedAt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Completed Date
              </label>
              <p className="text-foreground">
                {new Date(enrollment.completedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Card>

      {enrollment.courseId?.description && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Course Description
          </h2>
          <p className="text-muted-foreground">
            {enrollment.courseId.description}
          </p>
        </Card>
      )}
    </div>
  );
}
