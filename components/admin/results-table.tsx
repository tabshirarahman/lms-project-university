"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ResultsTable() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const { data, mutate } = useSWR(`/api/results?page=${page}&limit=10`, fetcher)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      await fetch(`/api/results/${id}`, { method: "DELETE" })
      mutate()
    } catch (error) {
      alert("Failed to delete result")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Results</h2>
        <Button asChild>
          <Link href="/admin/results/new">Add Result</Link>
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left p-4">Student</th>
                <th className="text-left p-4">Exam</th>
                <th className="text-left p-4">Total Marks</th>
                <th className="text-left p-4">GPA</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : data?.data?.length ? (
                data.data.map((result: any) => (
                  <tr key={result._id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{result.studentId?.userId?.name}</td>
                    <td className="p-4">{result.examId?.examName}</td>
                    <td className="p-4">{result.total}</td>
                    <td className="p-4">{result.gpa.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          result.status === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/results/${result._id}`}>View</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(result._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {data?.pagination && (
        <div className="flex justify-center gap-2">
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
