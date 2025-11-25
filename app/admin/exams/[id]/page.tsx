import { ExamForm } from "@/components/admin/exam-form";

export default function EditExamPage({ params }: { params: { id: string } }) {
  return <ExamForm id={params.id} />;
}
