import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          LMS Platform
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/courses" className="text-sm font-medium text-foreground hover:text-primary">
            Courses
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary">
            About
          </Link>
          <Link href="/surveys" className="text-sm font-medium text-foreground hover:text-primary">
            Surveys
          </Link>
          <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary">
            Contact
          </Link>

          <div className="flex gap-2 ml-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
