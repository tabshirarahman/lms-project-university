"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import useSWR from "swr";

type SubjectFormInput = {
  name: string;
  code: string;
  credit: number;
  departmentId: string;
};

export function SubjectForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);
  const { data: departments } = useSWR("/api/departments");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubjectFormInput>({
    resolver: zodResolver(SubjectFormSchema),
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/subjects/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset(data);
          setIsLoadingData(false);
        })
        .catch(() => setIsLoadingData(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: SubjectFormInput) => {
    setIsLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/subjects/${id}` : "/api/subjects";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");
      router.push("/admin/subjects");
    } catch (error) {
      alert("Error saving subject");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {id ? "Edit Subject" : "New Subject"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Subject Name
          </label>
          <Input {...register("name")} placeholder="e.g., Data Structures" />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Subject Code
            </label>
            <Input {...register("code")} placeholder="e.g., CS201" />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Credit Hours
            </label>
            <Input
              {...register("credit", { valueAsNumber: true })}
              type="number"
              placeholder="3"
            />
            {errors.credit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.credit.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Department
          </label>
          <select
            {...register("departmentId")}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="">Select Department</option>
            {departments?.map((dept: any) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Subject"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
