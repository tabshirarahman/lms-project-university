"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clientFetch } from "@/lib/fetcher";

export default function StakeholdersPage() {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
     const [stakeholders, setStakeholders] = useState<any[]>([]);
     console.log("🚀 ~ StakeholdersPage ~ stakeholders:", stakeholders)
     const [loading, setLoading] = useState(true);
  // 🔥 Next.js built-in fetch (client version)
  async function loadData() {
    setLoading(true);
    try {
      const data = await clientFetch("/api/stakeholders");
      setStakeholders(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/stakeholders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
     
    } catch (error) {
      alert("Error deleting stakeholder");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Stakeholders</h1>
        <Button asChild>
          <Link href="/admin/stakeholders/new">Add Stakeholder</Link>
        </Button>
      </div>

      {!stakeholders ? (
        <div className="text-center py-8">Loading...</div>
      ) : stakeholders?.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No stakeholders found</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Responsibilities
                </th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {stakeholders.map((sh: any) => (
                <tr key={sh._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">{sh.name}</td>
                  <td className="px-4 py-3">{sh.type}</td>
                  <td className="px-4 py-3">{sh.responsibilities || "-"}</td>
                  <td className="px-4 py-3">{sh.contactInfo || "-"}</td>

                  <td className="px-4 py-3 text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/stakeholders/${sh._id}`}>Edit</Link>
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting === sh._id}
                      onClick={() => handleDelete(sh._id)}
                    >
                      {isDeleting === sh._id ? "Deleting..." : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
