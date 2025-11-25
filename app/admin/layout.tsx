import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
        <nav className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/students">Students</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/departments">Departments</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/subjects">Subjects</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/exams">Exams</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/courses">Courses</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/enrollments">Enrollments</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/results">Results</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/stakeholders">Stakeholders</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/surveys">Surveys</Link>
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
