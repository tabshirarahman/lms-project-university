"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/session"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StudentResultsPage() {
  const [studentId, setStudentId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchStudent = async () => {
      const session = await getSession()
      if (session) {
        setStudentId(session.userId)
      }
    }

    fetchStudent()
  }, [])

  const { data } = useSWR(studentId ? `/api/results?studentId=${studentId}&page=${page}&limit=10` : null, fetcher)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground">View all your exam results and grades</p>
      </div>

      <Input
        placeholder="Search by exam name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="space-y-4">
        {data?.data?.map((result: any) => (
          <Card key={result._id} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Exam</p>
                <p className="font-bold text-foreground">{result.examId?.examName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="font-bold text-foreground">{result.total}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="font-bold text-primary">{result.gpa.toFixed(2)}</p>
              </div>

              <div className="flex items-end">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                      result.status === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.status}
                  </div>
                </div>
              </div>
            </div>

            {result.subjects?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-3">Subjects:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.subjects.map((subj: any, idx: number) => (
                    <div key={idx} className="text-sm p-2 bg-muted rounded">
                      <p className="font-medium text-foreground">{subj.subjectId?.name}</p>
                      <p className="text-muted-foreground">
                        Marks: {subj.marks} | Grade: {subj.grade}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {!data?.data?.length && <Card className="p-8 text-center text-muted-foreground">No results found</Card>}
      </div>

      {data?.pagination && (
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="flex items-center text-muted-foreground">
            Page {page} of {data.pagination.pages}
          </span>
          <Button variant="outline" disabled={page === data.pagination.pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
