"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RecentResults() {
  const { data } = useSWR("/api/results?limit=5", fetcher)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-foreground">Recent Results</h3>
        <Link href="/admin/results" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {data?.data?.length ? (
          data.data.map((result: any) => (
            <Card key={result._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground">{result.studentId?.userId?.name}</p>
                  <p className="text-sm text-muted-foreground">{result.examId?.examName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{result.gpa.toFixed(2)} GPA</p>
                  <Badge variant={result.status === "Pass" ? "default" : "destructive"} className="text-xs mt-1">
                    {result.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No results yet</p>
        )}
      </div>
    </div>
  )
}
