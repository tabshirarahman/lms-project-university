"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function StudentNavbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/student/dashboard" className="text-2xl font-bold text-primary">
          LMS Platform
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/student/dashboard" className="text-sm font-medium text-foreground hover:text-primary">
            Dashboard
          </Link>
          <Link href="/student/results" className="text-sm font-medium text-foreground hover:text-primary">
            Results
          </Link>
          <Link href="/student/profile" className="text-sm font-medium text-foreground hover:text-primary">
            Profile
          </Link>

          <Button size="sm" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
