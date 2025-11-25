"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DepartmentsTable() {
  const { data, isLoading, mutate } = useSWR("/api/departments", fetcher)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDepts = data?.filter(
    (dept: any) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      await fetch(`/api/departments/${id}`, { method: "DELETE" })
      mutate()
    } catch (error) {
      alert("Failed to delete department")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Departments</h2>
        <Button asChild>
          <Link href="/admin/departments/new">Add Department</Link>
        </Button>
      </div>

      <Input placeholder="Search departments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Code</th>
                <th className="text-left p-4">Description</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredDepts?.length ? (
                filteredDepts.map((dept: any) => (
                  <tr key={dept._id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{dept.name}</td>
                    <td className="p-4">{dept.code}</td>
                    <td className="p-4 text-muted-foreground">{dept.description}</td>
                    <td className="p-4 space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/departments/${dept._id}`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(dept._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No departments found
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
