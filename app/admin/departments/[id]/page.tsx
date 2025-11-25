import { DepartmentForm } from "@/components/admin/department-form"

export default function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const paramsSync = JSON.parse(JSON.stringify(params))
  return <DepartmentForm id={paramsSync.id} />
}
