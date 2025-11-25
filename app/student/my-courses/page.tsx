import { getStudentId } from "@/lib/auth/get-student-id";
import { getStudentEnrolledCourses } from "@/lib/services/student-courses.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyCoursesPage() {
  const studentId = await getStudentId();
  console.log("🚀 ~ MyCoursesPage ~ studentId:", studentId)

  if (!studentId) {
    redirect("/login");
  }

  const enrolledCourses = await getStudentEnrolledCourses(studentId);
  console.log("🚀 ~ MyCoursesPage ~ enrolledCourses:", enrolledCourses)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground">
            You have enrolled in {enrolledCourses.length}{" "}
            {enrolledCourses.length === 1 ? "course" : "courses"}
          </p>
        </div>
        <Button asChild>
          <Link href="/courses">Browse More Courses</Link>
        </Button>
      </div>

      {enrolledCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              No Courses Yet
            </h3>
            <p className="text-muted-foreground">
              You have not enrolled in any courses yet. Browse our course
              catalog to get started!
            </p>
            <Button asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card
              key={course._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {course.thumbnail && (
                <div className="aspect-video bg-muted">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="text-xs">
                    Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/courses/${course._id}`}>Continue Learning</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
