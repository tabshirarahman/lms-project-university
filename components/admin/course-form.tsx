"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type CourseFormInput = {
  title: string;
  description?: string;
  category?: string;
  level?: string;
  mode: "online" | "offline";
  price: number;
  status: "draft" | "published" | "archived";
  relatedSubjects?: string[];
};

export function CourseForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormInput>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: { mode: "online", status: "draft", price: 0 },
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/courses/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset(data);
          setIsLoadingData(false);
        })
        .catch(() => setIsLoadingData(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: CourseFormInput) => {
    setIsLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/courses/${id}` : "/api/courses";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");
      router.push("/admin/courses");
    } catch (error) {
      alert("Error saving course");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {id ? "Edit Course" : "New Course"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Course Title
          </label>
          <Input
            {...register("title")}
            placeholder="e.g., Web Development Basics"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Course description"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <Input {...register("category")} placeholder="e.g., Technology" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Level
            </label>
            <Input {...register("level")} placeholder="e.g., Beginner" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Mode
            </label>
            <select
              {...register("mode")}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Price
            </label>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Course"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
