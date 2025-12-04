import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function Home() {

  let stats = {
    students: 0,
    courses: 0,
    results: 0,
  };
  

  try {
    const baseURL =
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "https://lms-project-university-7hea.vercel.app";

    const [resultsRes, courseRes, studentRes] = await Promise.all([
      fetch(`${baseURL}/api/results`, { cache: "no-store" }),
      fetch(`${baseURL}/api/courses`, { cache: "no-store" }),
      fetch(`${baseURL}/api/students`, { cache: "no-store" }),
    ]);

    

    const [result, course, student] = await Promise.all([
      resultsRes.ok ? resultsRes.json() : null,
      courseRes.ok ? courseRes.json() : null,
      studentRes.ok ? studentRes.json() : null,
    ]);



    stats = {
      results: result?.pagination?.total || 0,
      courses: course?.pagination?.total || 0,
      students: student?.pagination?.total || 0,
    };
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
  }





  return (
    <main className="min-h-screen bg-linear-to-b from-background to-card">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
          Transform Education with Modern Learning Management
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance max-w-3xl mx-auto">
          A comprehensive platform for managing courses, tracking results, and
          gathering student feedback in one unified system.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 bg-transparent"
          >
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {stats.students}+
              </p>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {stats.courses}+
              </p>
              <p className="text-muted-foreground">Courses Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{ stats.results}+</p>
              <p className="text-muted-foreground">Results Processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Course Management
            </h3>
            <p className="text-muted-foreground">
              Comprehensive course creation and management tools with multimedia
              support.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Result Tracking
            </h3>
            <p className="text-muted-foreground">
              Real-time result management with automatic GPA calculation and
              pass/fail determination.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Survey & Feedback
            </h3>
            <p className="text-muted-foreground">
              Collect valuable student feedback through customizable surveys and
              analytics.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Student Management
            </h3>
            <p className="text-muted-foreground">
              Centralized student database with detailed profiles and enrollment
              tracking.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Secure & Reliable
            </h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with encrypted data and role-based
              access control.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Responsive Design
            </h3>
            <p className="text-muted-foreground">
              Works seamlessly on desktop, tablet, and mobile devices.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join institutions and educators already using LMS Platform
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/auth/register">Create Account Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
