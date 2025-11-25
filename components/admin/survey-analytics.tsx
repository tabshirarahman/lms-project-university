"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SurveyAnalytics() {
  const { data: stats } = useSWR("/api/survey-stats", fetcher)

  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-4">Survey Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-0">
          <p className="text-sm text-slate-600 mb-2">Total Responses</p>
          <p className="text-3xl font-bold text-slate-900">{stats?.totalResponses || 0}</p>
        </Card>

        <Card className="p-6 bg-green-50 border-0">
          <p className="text-sm text-slate-600 mb-2">Student Satisfaction</p>
          <p className="text-3xl font-bold text-slate-900">{stats?.satisfactionScore || 0}%</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-0">
          <p className="text-sm text-slate-600 mb-2">Active Public Surveys</p>
          <p className="text-3xl font-bold text-slate-900">{stats?.publicSurveysCount || 0}</p>
        </Card>
      </div>
    </div>
  )
}
