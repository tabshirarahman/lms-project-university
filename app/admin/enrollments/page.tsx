import { EnrollmentsTable } from "@/components/admin/enrollments-table";

export default function AdminEnrollmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Enrollments Management
        </h1>
        <p className="text-muted-foreground">
          Manage student course enrollments and payment status
        </p>
      </div>
      <EnrollmentsTable />
    </div>
  );
}
