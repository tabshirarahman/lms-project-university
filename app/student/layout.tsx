import type React from "react"
import { StudentNavbar } from "@/components/student/student-navbar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
