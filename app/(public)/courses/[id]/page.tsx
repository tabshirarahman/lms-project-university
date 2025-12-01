import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EnrollmentButton } from "@/components/course/enrollment-button";
import { requireStudentId } from "@/lib/auth/get-student-id";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = await requireStudentId();
  console.log(">>>>>>>>>",studentId);

  let course = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/courses/${id}`,
      {
        cache: "no-store",
      }
    );
    if (response.ok) {
      course = await response.json();
    }
  } catch (error) {
    // Course not found
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Course Not Found
          </h1>
          <Button asChild className="mt-4">
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button asChild variant="outline" className="mb-8 bg-transparent">
          <Link href="/courses">← Back to Courses</Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-8" />

            <h1 className="text-4xl font-bold text-foreground mb-4">
              {course.title}
            </h1>

            <div className="flex gap-3 mb-6 flex-wrap">
              {course.category && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {course.category}
                </span>
              )}
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                {course.mode}
              </span>
              {course.level && (
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {course.level}
                </span>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Course Overview
              </h2>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            {course.relatedSubjects?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Related Subjects
                </h2>
                <div className="space-y-2">
                  {course.relatedSubjects.map((subject: any) => (
                    <Card key={subject._id} className="p-4">
                      <p className="font-medium text-foreground">
                        {subject.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Code: {subject.code} | Credits: {subject.credit}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Card className="p-6 sticky top-4">
              <p className="text-4xl font-bold text-primary mb-6">
                ${course.price}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Course Type</p>
                  <p className="font-medium text-foreground">{course.mode}</p>
                </div>
                {course.level && (
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-medium text-foreground">
                      {course.level}
                    </p>
                  </div>
                )}
              </div>

              <EnrollmentButton
                courseId={id}
                price={course.price}
                studentId={studentId}
              />

              <Button variant="outline" className="w-full bg-transparent mt-3">
                Share Course
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
