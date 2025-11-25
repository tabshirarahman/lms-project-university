"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSWR from "swr";
import { clientFetch } from "@/lib/fetcher";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SurveyResponseForm({ surveyId }: { surveyId: string }) {
  const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit } = useForm();
  // 🔥 Load survey questions
  async function loadQuestions() {
    try {
      const data = await clientFetch(
        `/api/survey-questions?surveyId=${surveyId}`
      );
      setQuestions(data?.data || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const answers = questions?.map((q: any) => ({
        questionId: q._id,
        answer: formData[`question_${q._id}`],
      }));

      const response = await fetch("/api/survey-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId, answers }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch (error) {
      alert("Error submitting survey response");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <p className="text-green-700 text-center font-medium">
          Thank you for your feedback!
        </p>
      </Card>
    );
  }

  if (!questions) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {questions?.map((question: any) => (
        <div key={question._id} className="space-y-2">
          <label className="block font-medium text-foreground">
            {question.questionText}
          </label>

          {question.type === "text" && (
            <textarea
              {...register(`question_${question._id}`)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
              placeholder="Your answer"
              required
            />
          )}

          {question.type === "mcq" && (
            <div className="space-y-2">
              {question.options.map((option: string) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    {...register(`question_${question._id}`)}
                    value={option}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === "rating" && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    {...register(`question_${question._id}`)}
                    value={rating}
                    required
                  />
                  <span className="text-lg">{"★"}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Response"}
      </Button>
    </form>
  );
}
