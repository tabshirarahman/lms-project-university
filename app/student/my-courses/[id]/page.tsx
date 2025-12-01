import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";


export default async function SingleMyCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
    }) {
    
    const { id } = await params;

    
  const res = await fetch(`${process.env.VERCEL_URL}/api/enrollments/${id}`, {
    cache: "no-store",
    credentials: "include",
  });


  if (!res.ok) {
    return (
      <div className="p-10 text-center text-destructive font-medium">
        Course not found or you do not have access.
      </div>
    );
  }

    const   enrollment  = await res.json();
  
    
    const course = enrollment?.courseId

  const statusColor =
    enrollment?.status &&  enrollment?.status === "completed"
      ? "bg-green-600"
      : enrollment.status === "pending"
      ? "bg-yellow-600"
      : "bg-blue-600";

  const progress =enrollment?.status &&  enrollment?.status === "completed" ? 100 : 40; 

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Course Header */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
        <Image
          src={course?.thumbnail || "/placeholder.svg"}
          alt={course?.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{course?.title}</h1>
            <p className="text-white/80 mt-1">{course?.category}</p>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Info */}
        <Card className="md:col-span-2 border">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Course Overview</h2>

            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>

            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="font-medium">Status:</span>
              <Badge className={`${statusColor} text-white`}>
                {enrollment?.status.toUpperCase()}
              </Badge>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button asChild className="px-6">
                <a href={`/courses/${course._id}`}>Continue Learning</a>
              </Button>

              {enrollment.status === "completed" && (
                <Button variant="outline" className="px-6">
                  Download Certificate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Enrollment Info */}
        <Card className="border">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold mb-3">Enrollment Details</h2>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Enrolled on:</span>{" "}
                {new Date(enrollment.enrolledAt).toLocaleString()}
              </p>

              {enrollment.completedAt && (
                <p>
                  <span className="font-medium">Completed on:</span>{" "}
                  {new Date(enrollment.completedAt).toLocaleString()}
                </p>
              )}

              <p>
                <span className="font-medium">Payment Amount:</span> $
                {(enrollment.amount / 100).toFixed(2)}
              </p>

              <p className="break-all">
                <span className="font-medium">Stripe Session:</span>{" "}
                {enrollment.stripeSessionId}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Course Assets Section */}
      {course.assets?.length > 0 && (
        <Card className="border">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Course Files & Resources</h2>

            <div className="space-y-4">
              {course.assets.map((file: any) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* file type icon */}
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {file.type.startsWith("image") ? (
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={48}
                          height={48}
                          className="object-cover rounded"
                        />
                      ) : (
                        <span className="text-sm font-bold uppercase">
                          {file.type.split("/")[1]}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT ACTION BUTTONS */}
                  <div className="flex gap-2">
                    {/* VIEW Button */}
                    <Button variant="outline" className="px-4" asChild>
                      <a href={file.url} target="_blank">
                        View
                      </a>
                    </Button>

                    {/* DOWNLOAD Button */}
                    <Button className="px-4" asChild>
                      <a href={file.url} download>
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section - More Info */}
      <Card className="border">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">About this Course</h2>

          <p className="text-muted-foreground leading-relaxed">
            {course.longDescription ||
              "This course provides in-depth training and resources to help you master the subject. Continue learning to unlock all modules."}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
