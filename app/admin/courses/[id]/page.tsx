import { CourseForm } from "@/components/admin/course-form";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto py-8">
      <CourseForm id={(params as any).id} />
    </div>
  );
}
