"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SurveyQuestionSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function NewSurveyQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const router = useRouter();
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);




  const {
    register,
    handleSubmit,
    formState: { errors },
setValue,
    watch,
  } = useForm({
    resolver: zodResolver(SurveyQuestionSchema),
    defaultValues: { surveyId: "", type: "mcq", questionText: "", options: [] },
  });

    const questionType = watch("type");
    
    console.log("form errors:", errors);
    
    useEffect(() => {
      Promise.resolve(params).then((p) => {
        setSurveyId(p.id);
        setValue("surveyId", p.id); // <--- FIX
      });
    }, [params, setValue]);
   

  const onSubmit = async (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    setIsLoading(true);
    try {
      const response = await fetch("/api/survey-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId,
          ...data,
          options: questionType === "mcq" ? options : [],
        }),
      });

      if (!response.ok) throw new Error("Failed to create question");
      router.push(`/admin/surveys/${surveyId}/questions`);
    } catch (error) {
      alert("Error creating question");
    } finally {
      setIsLoading(false);
    }
  };

  if (!surveyId) return <div>Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Add Survey Question
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Question Type
          </label>
          <select
            {...register("type")}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="rating">Rating</option>
            <option value="text">Text</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Question
          </label>
          <textarea
            {...register("questionText")}
            placeholder="Enter your question"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            rows={3}
          />
          {errors.questionText && (
            <p className="text-red-500 text-sm mt-1">
              {(errors.questionText as any).message}
            </p>
          )}
        </div>

        {questionType === "mcq" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Options
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      setOptions(options.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setOptions([...options, ""])}
              >
                Add Option
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Question"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
