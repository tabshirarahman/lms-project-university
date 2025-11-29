import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudentId } from "@/lib/auth/get-student-id";
import {
  getStudentEnrolledCourses,
  getStudentEnrolledCoursesCount,
} from "@/lib/services/student-courses.service";
import { connectDB } from "@/lib/db/mongoose";

async function getResultsCount(studentId: string) {
  await connectDB();
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      "http://localhost:3000"
    }/api/results?studentId=${studentId}&limit=5`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
}

export default async function StudentDashboard() {
  const studentId = await getStudentId();

  if (!studentId) {
    redirect("/login");
  }

  // Fetch data in parallel
  const [enrolledCourses, enrolledCount, recentResults] = await Promise.all([
    getStudentEnrolledCourses(studentId),
    getStudentEnrolledCoursesCount(studentId),
    getResultsCount(studentId).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-border rounded-lg p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">
          Check your results, browse courses, and complete surveys below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Results</p>
            <p className="text-3xl font-bold text-primary">
              {recentResults.length || 0}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Enrolled Courses
            </p>
            <p className="text-3xl font-bold text-primary">{enrolledCount+1}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Surveys Completed
            </p>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Results
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/student/results">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentResults.slice(0, 3).map((result: any) => (
              <Card
                key={result._id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">
                      {result.examId?.examName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {result.subjects?.length} subjects
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {result.total} marks
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        result.status === "Pass"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.status}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {recentResults.length === 0 && (
              <Card className="p-4 text-center text-muted-foreground">
                No results yet
              </Card>
            )}
          </div>
        </div>

        {/* My Enrolled Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              My Enrolled Courses
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/student/my-courses">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {enrolledCourses.slice(0, 3).map((course) => (
              <Card
                key={course._id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {course.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {course.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enrolled:{" "}
                      {new Date(course.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {enrolledCourses.length === 0 && (
              <Card className="p-4 text-center">
                <p className="text-muted-foreground mb-2">
                  No enrolled courses yet
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
