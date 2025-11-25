"use client";

import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SurveyResponseForm } from "@/components/public/survey-response-form";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SurveysPage() {
  const { data: surveys } = useSWR("/api/surveys?visibility=public", fetcher);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

  if (selectedSurvey) {
    const survey = surveys?.data?.find((s: any) => s._id === selectedSurvey);
    return (
      <div className="container mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => setSelectedSurvey(null)}
          className="mb-4"
        >
          ← Back to Surveys
        </Button>
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {survey.title}
          </h1>
          <p className="text-muted-foreground mb-6">{survey.description}</p>
          <SurveyResponseForm surveyId={selectedSurvey} />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Public Surveys
      </h1>

      <div className="grid gap-6">
        {surveys?.data?.length ? (
          surveys?.data?.map((survey: any) => (
            <Card key={survey._id} className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {survey.title}
              </h2>
              <p className="text-muted-foreground mb-4">{survey.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Target Group: {survey.targetGroup}
                </p>
                <Button onClick={() => setSelectedSurvey(survey._id)}>
                  Take Survey
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            No public surveys available
          </Card>
        )}
      </div>
    </div>
  );
}
