"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export function EnrollmentsTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "20",
  });

  if (statusFilter !== "all") {
    queryParams.append("status", statusFilter);
  }

  const { data, isLoading, mutate } = useSWR(
    `/api/admin/enrollments?${queryParams.toString()}`,
    fetcher
  );

  const handleStatusChange = async (
    enrollmentId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      mutate();
    } catch (error) {
      alert("Failed to update enrollment status");
    }
  };

  const handleDelete = async (enrollmentId: string) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return;

    try {
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      mutate();
    } catch (error) {
      alert("Failed to delete enrollment");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Course Enrollments
        </h2>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left p-4">Student</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Enrolled Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data?.data?.length ? (
                data.data.map((enrollment: any) => (
                  <tr
                    key={enrollment._id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="font-medium">
                        {enrollment.studentId?.name || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {enrollment.studentId?.email}
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      {enrollment.courseId?.title || "Deleted Course"}
                    </td>
                    <td className="p-4">${enrollment.amount}</td>
                    <td className="p-4">
                      <Select
                        value={enrollment.status}
                        onValueChange={(value) =>
                          handleStatusChange(enrollment._id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
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
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/enrollments/${enrollment._id}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(enrollment._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No enrollments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {data?.pagination && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center text-muted-foreground">
            Page {page} of {data.pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === data.pagination.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
