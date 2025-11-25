import { SurveyForm } from "@/components/admin/survey-form"

export default function EditSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const paramsSync = JSON.parse(JSON.stringify(params))
  return <SurveyForm id={paramsSync.id} />
}
