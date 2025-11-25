"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SurveyQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);

  // Initialize params
  Promise.resolve(params).then((p) => setId(p.id));

  const { data: questions, mutate } = useSWR(
    id ? `/api/survey-questions?surveyId=${id}` : null,
    fetcher
  );

  const handleDelete = async (questionId: string) => {
    if (!confirm("Delete this question?")) return;

    try {
      await fetch(`/api/survey-questions/${questionId}`, { method: "DELETE" });
      mutate();
    } catch (error) {
      alert("Failed to delete question");
    }
  };

  if (!id) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Survey Questions</h2>
        <Button asChild>
          <Link href={`/admin/surveys/${id}/questions/new`}>Add Question</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {questions?.map((q: any) => (
          <Card key={q._id} className="p-4 flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-foreground">{q.questionText}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Type: {q.type}
              </p>
              {q.options?.length > 0 && (
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">Options:</p>
                  <ul className="ml-4 list-disc">
                    {q.options.map((opt: string, i: number) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(q._id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
