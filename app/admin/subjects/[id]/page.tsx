import { SubjectForm } from "@/components/admin/subject-form";

export default function EditSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto py-8">
      <SubjectForm id={(params as any).id} />
    </div>
  );
}
