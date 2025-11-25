"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { clientFetch } from "@/lib/fetcher";

type ResultFormInput = {
  studentId: string;
  examId: string;
  subjects: Array<{
    subjectId: string;
    marks: number;
    grade: string;
  }>;
};

export function ResultForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);

  // 🔥 Fetch Students & Subjects (Next.js built-in fetcher)
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  async function loadStudents() {
    const res = await clientFetch("/api/students");
    setStudents(res.data || []);
  }

  async function loadSubjects() {
    const res = await clientFetch("/api/subjects");
    setSubjects(res.data || []);
  }

  useEffect(() => {
    loadStudents();
    loadSubjects();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ResultFormInput>({
    resolver: zodResolver(ResultFormSchema),
    defaultValues: { subjects: [{ subjectId: "", marks: 0, grade: "A" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/results/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset(data);
          setIsLoadingData(false);
        })
        .catch(() => setIsLoadingData(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: ResultFormInput) => {
    setIsLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/results/${id}` : "/api/results";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");
      router.push("/admin/results");
    } catch (error) {
      alert("Error saving result");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {id ? "Edit Result" : "New Result"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Student
            </label>
            <select
              {...register("studentId")}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="">Select Student</option>
              {students?.map((student: any) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.roll})
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Exam ID
            </label>
            <Input {...register("examId")} placeholder="Exam reference" />
            {errors.examId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.examId.message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Subject Marks
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ subjectId: "", marks: 0, grade: "A" })}
            >
              Add Subject
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Subject
                  </label>
                  <select
                    {...register(`subjects.${index}.subjectId`)}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    <option value="">Select Subject</option>
                    {subjects?.map((subj: any) => (
                      <option key={subj._id} value={subj._id}>
                        {subj.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Marks
                  </label>
                  <Input
                    {...register(`subjects.${index}.marks`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="100"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Grade
                    </label>
                    <select
                      {...register(`subjects.${index}.grade`)}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="mt-6"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Result"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
