"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SurveysAdminPage() {
  const { data: surveys, mutate } = useSWR("/api/surveys", fetcher)
  const [expandedSurvey, setExpandedSurvey] = useState<string | null>(null)
  const { data: questions } = useSWR(
    expandedSurvey ? `/api/survey-questions?surveyId=${expandedSurvey}` : null,
    fetcher,
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      await fetch(`/api/surveys/${id}`, { method: "DELETE" })
      mutate()
    } catch (error) {
      alert("Failed to delete survey")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Surveys</h2>
        <Button asChild>
          <Link href="/admin/surveys/new">Create Survey</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {surveys?.data?.map((survey: any) => (
          <Card key={survey._id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{survey.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{survey.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Visibility: {survey.visibility}</span>
                  <span>Target: {survey.targetGroup}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/surveys/${survey._id}`}>Edit</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedSurvey(expandedSurvey === survey._id ? null : survey._id)}
                >
                  {expandedSurvey === survey._id ? "Hide" : "Questions"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(survey._id)}>
                  Delete
                </Button>
              </div>
            </div>

            {expandedSurvey === survey._id && questions && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-foreground">Questions</h4>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/surveys/${survey._id}/questions`}>Add Question</Link>
                  </Button>
                </div>
                {questions.length ? (
                  <ul className="space-y-2">
                    {questions?.map((q: any) => (
                      <li key={q._id} className="text-sm p-3 bg-muted rounded flex justify-between items-center">
                        <span>
                          {q.questionText}
                          <span className="text-xs text-muted-foreground ml-2">({q.type})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No questions yet</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
