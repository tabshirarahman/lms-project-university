import Link from "next/link"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const actions = [
    { label: "Add Student", href: "/admin/students/new", icon: "➕" },
    { label: "Add Department", href: "/admin/departments/new", icon: "🏢" },
    { label: "Add Subject", href: "/admin/subjects/new", icon: "📖" },
    { label: "Add Course", href: "/admin/courses/new", icon: "📚" },
    { label: "Create Survey", href: "/admin/surveys/new", icon: "📋" },
    { label: "Add Result", href: "/admin/results/new", icon: "📊" },
  ]

  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Button key={action.href} asChild variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <Link href={action.href}>
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs text-center">{action.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
