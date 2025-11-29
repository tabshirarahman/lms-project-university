import { CourseForm } from "@/components/admin/course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-8">
      <CourseForm id={id} />
    </div>
  );
}
