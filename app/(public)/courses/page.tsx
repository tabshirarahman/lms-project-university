"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [status] = useState("published")
  const { data } = useSWR(`/api/courses?status=${status}&limit=100`, fetcher)

  const filteredCourses = data?.data?.filter(
    (course: any) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Browse Courses</h1>
        <p className="text-lg text-muted-foreground">Discover and enroll in our range of high-quality courses</p>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <Input
          placeholder="Search courses by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {filteredCourses?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course: any) => (
              <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {course.thumbnail && <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5" />}

                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    {course.category && (
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {course.category}
                      </span>
                    )}
                    <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      {course.mode}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">${course.price}</span>
                    <span className="text-xs text-muted-foreground">{course.level || "All levels"}</span>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/courses/${course._id}`}>View Course</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {search ? "No courses found matching your search" : "No courses available"}
            </p>
          </Card>
        )}
      </section>
    </main>
  )
}
