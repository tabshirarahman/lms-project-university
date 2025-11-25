"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SubjectsTable() {
  const [search, setSearch] = useState("")
  const { data: departments } = useSWR("/api/departments", fetcher)
  const { data: subjects, mutate: mutateSubjects } = useSWR("/api/subjects", fetcher)

  const filteredSubjects = subjects?.data?.filter(
    (subj: any) =>
      subj.name.toLowerCase().includes(search.toLowerCase()) || subj.code.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      await fetch(`/api/subjects/${id}`, { method: "DELETE" })
      mutateSubjects()
    } catch (error) {
      alert("Failed to delete subject")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Subjects</h2>
        <Button asChild>
          <Link href="/admin/subjects/new">Add Subject</Link>
        </Button>
      </div>

      <Input placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Code</th>
                <th className="text-left p-4">Credit</th>
                <th className="text-left p-4">Department</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!subjects ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredSubjects?.length ? (
                filteredSubjects.map((subj: any) => (
                  <tr key={subj._id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{subj.name}</td>
                    <td className="p-4">{subj.code}</td>
                    <td className="p-4">{subj.credit}</td>
                    <td className="p-4">{subj.departmentId?.name}</td>
                    <td className="p-4 space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/subjects/${subj._id}`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(subj._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
