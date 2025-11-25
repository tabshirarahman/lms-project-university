"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Exam {
  _id: string;
  examName: string;
  year: number;
  session: string;
  type?: string;
}

export function ExamsTable() {
  const [exams, setExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
      const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/exams");
      const data = await response.json();
      setExams(data.exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/exams/${id}`, { method: "DELETE" });
      if (response.ok) {
        setExams((prev) => prev.filter((exam) => exam._id !== id));
      }
    } catch (error) {
      alert("Error deleting exam");
    }
    };
     const copyId = async (id: string) => {
       await navigator.clipboard.writeText(id);
       setCopiedId(id);
       setTimeout(() => setCopiedId(null), 1200);
     };


  if (isLoading)
    return <div className="text-center py-8">Loading exams...</div>;

  return (
    <Card className="overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Exam ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Exam Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Year
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Session
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
              Type
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {exams.map((exam) => (
            <tr key={exam._id} className="hover:bg-muted/50">
              <td className="px-6 py-4">
                <button
                  onClick={() => copyId(exam._id)}
                  className="text-xs font-mono bg-accent px-2 py-1 rounded hover:bg-accent/70 transition"
                >
                  {exam._id.slice(0, 6)}…{exam._id.slice(-4)}
                </button>

                {copiedId === exam._id && (
                  <span className="ml-2 text-green-600 text-xs">Copied!</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {exam.examName}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">{exam.year}</td>
              <td className="px-6 py-4 text-sm text-foreground">
                {exam.session}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {exam.type || "-"}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/exams/${exam._id}`}>Edit</Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(exam._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
