"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function StudentsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data, isLoading, mutate } = useSWR(`/api/students?page=${page}&search=${search}`, fetcher)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      await fetch(`/api/students/${id}`, { method: "DELETE" })
      mutate()
    } catch (error) {
      alert("Failed to delete student")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Students</h2>
        <Button asChild>
          <Link href="/admin/students/new">Add Student</Link>
        </Button>
      </div>

      <Input
        placeholder="Search by name, roll, or registration..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Roll</th>
                <th className="text-left p-4">Registration</th>
                <th className="text-left p-4">Batch</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : data?.data?.length ? (
                data.data.map((student: any) => (
                  <tr key={student._id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{student.userId?.name}</td>
                    <td className="p-4">{student.roll}</td>
                    <td className="p-4">{student.registration}</td>
                    <td className="p-4">{student.batch}</td>
                    <td className="p-4 space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/students/${student._id}`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(student._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No students found
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
