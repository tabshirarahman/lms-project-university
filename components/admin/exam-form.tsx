"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExamFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type ExamFormInput = {
  examName: string;
  year: number;
  session: string;
  type?: string;
};

export function ExamForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExamFormInput>({
    resolver: zodResolver(ExamFormSchema),
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/exams/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset(data);
          setIsLoadingData(false);
        })
        .catch(() => setIsLoadingData(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: ExamFormInput) => {
    setIsLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/exams/${id}` : "/api/exams";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");
      router.push("/admin/exams");
    } catch (error) {
      alert("Error saving exam");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {id ? "Edit Exam" : "New Exam"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Exam Name
          </label>
          <Input {...register("examName")} placeholder="e.g., Midterm Exam" />
          {errors.examName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.examName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Year
            </label>
            <Input
              {...register("year", { valueAsNumber: true })}
              type="number"
              placeholder="2024"
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Session
            </label>
            <Input {...register("session")} placeholder="e.g., Spring 2024" />
            {errors.session && (
              <p className="text-red-500 text-sm mt-1">
                {errors.session.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Exam Type
          </label>
          <Input {...register("type")} placeholder="e.g., Written, Online" />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Exam"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
