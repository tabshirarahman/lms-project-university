"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DashboardCards() {
  const { data: students } = useSWR("/api/students?limit=1", fetcher)
  const { data: departments } = useSWR("/api/departments", fetcher)
  const { data: courses } = useSWR("/api/courses?limit=1", fetcher)
  const { data: results } = useSWR("/api/results?limit=1", fetcher)
  const { data: surveys  } = useSWR("/api/surveys", fetcher)
  console.log("🚀 ~ DashboardCards ~ surveys:", surveys)


  const stats = [
    {
      label: "Total Students",
      value: students?.pagination?.total || 0,
      icon: "👥",
      color: "from-blue-50 to-blue-100",
    },
    {
      label: "Departments",
      value: departments?.length || 0,
      icon: "🏢",
      color: "from-green-50 to-green-100",
    },
    {
      label: "Total Courses",
      value: courses?.pagination?.total || 0,
      icon: "📚",
      color: "from-purple-50 to-purple-100",
    },
    {
      label: "Results Processed",
      value: results?.pagination?.total || 0,
      icon: "📊",
      color: "from-orange-50 to-orange-100",
    },
    {
      label: "Active Surveys",
      value:surveys && surveys?.data?.filter((s: any) => s?.visibility === "public").length || 0,
      icon: "📋",
      color: "from-pink-50 to-pink-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`p-6 bg-gradient-to-br ${stat.color} border-0`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
