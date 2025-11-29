"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LoginModal } from "@/components/modals/LoginModal"
import { NotStudentModal } from "@/components/modals/NotStudentModal"
import { getStudentClient } from "@/lib/auth/get-student-id-client"


const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null);
  console.log("🚀 ~ CoursesPage ~ user:", user)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [search, setSearch] = useState("")
  const [status] = useState("published")
  const { data } = useSWR(`/api/courses?status=${status}&limit=100`, fetcher)

  const filteredCourses = data?.data?.filter(
    (course: any) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase()),
  )

  
    useEffect(() => {
      async function load() {
        const u = await getStudentClient();
        console.log("🚀 ~ load ~ u :", u )
        setUser(u);
      }
      load();
    }, []);

    const handleView = (e: any) => {
      if (!user) {
        e.preventDefault();
        setShowLoginModal(true);
        return;
      }

      if (user.role !== "student") {
        e.preventDefault();
        setShowRoleModal(true);
        return;
      }
    };

  return (
    <main className="min-h-screen bg-background">
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <NotStudentModal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Browse Courses
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover and enroll in our range of high-quality courses
        </p>
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
              <Card
                key={course._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {course.thumbnail && (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}

                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

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
                    <span className="text-2xl font-bold text-primary">
                      ${course.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.level || "All levels"}
                    </span>
                  </div>

                  <Button asChild className="w-full" onClick={handleView}>
                    <Link href={`/courses/${course._id}`}>View Course</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {search
                ? "No courses found matching your search"
                : "No courses available"}
            </p>
          </Card>
        )}
      </section>
    </main>
  );
}
