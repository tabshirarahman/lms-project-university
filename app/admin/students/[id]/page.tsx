import { StudentForm } from "@/components/admin/student-form"

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const paramsSync = JSON.parse(JSON.stringify(params))
  return <StudentForm id={paramsSync.id} />
}
