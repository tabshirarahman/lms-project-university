"use client"

import useSWR from "swr"
import { DashboardCards } from "@/components/admin/dashboard-cards"
import { SurveyAnalytics } from "@/components/admin/survey-analytics"
import { QuickActions } from "@/components/admin/quick-actions"
import { RecentResults } from "@/components/admin/recent-results"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminDashboardPage() {
  const { data: students } = useSWR("/api/students?limit=1", fetcher)
  const { data: departments } = useSWR("/api/departments", fetcher)
  const { data: courses } = useSWR("/api/courses?limit=1", fetcher)
  const { data: results } = useSWR("/api/results?limit=1", fetcher)

  const stats = [
    {
      label: "Total Students",
      value: students?.pagination?.total || 0,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Departments",
      value: departments?.length || 0,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Total Courses",
      value: courses?.pagination?.total || 0,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Total Results",
      value: results?.pagination?.total || 0,
      color: "bg-orange-50 text-orange-700",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your LMS administration panel</p>
      </div>

      {/* Key Metrics */}
      <DashboardCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <SurveyAnalytics />
          <RecentResults />
        </div>

        {/* Right Column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
