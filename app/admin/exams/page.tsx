import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExamsTable } from "@/components/admin/exams-table";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Exams</h1>
        <Button asChild>
          <Link href="/admin/exams/new">Add New Exam</Link>
        </Button>
      </div>

      <ExamsTable />
    </div>
  );
}
