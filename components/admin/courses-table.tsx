"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CoursesTable() {
  const [search, setSearch] = useState("")
  const { data, mutate } = useSWR("/api/courses?limit=100", fetcher)

  const filteredCourses = data?.data?.filter((course: any) => course.title.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" })
      mutate()
    } catch (error) {
      alert("Failed to delete course")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Courses</h2>
        <Button asChild>
          <Link href="/admin/courses/new">Add Course</Link>
        </Button>
      </div>

      <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredCourses?.length ? (
                filteredCourses.map((course: any) => (
                  <tr key={course._id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4">{course.category}</td>
                    <td className="p-4">${course.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          course.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/courses/${course._id}`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(course._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No courses found
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
