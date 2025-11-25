"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";


const StakeholderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  role: z.string().min(1, "Role is required"),
  organization: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type StakeholderFormInput = z.infer<typeof StakeholderSchema>;

export function StakeholderForm({ id }: { id?: string }) {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "student" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!id);
  // 🔥 Load user role from backend
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setRole(data.role))
      .catch(() => setRole(null));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StakeholderFormInput>({
    resolver: zodResolver(StakeholderSchema),
    defaultValues: { status: "active" },
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/stakeholders/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset(data);
          setIsLoadingData(false);
        })
        .catch(() => setIsLoadingData(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: StakeholderFormInput) => {
     const stakeholderType = role === "admin" ? "Admin" : "Student";
      const payload = {
        ...data,
        type: stakeholderType, // <-- FIX
      };
      console.log("🚀 ~ onSubmit ~ payload:", payload)
    setIsLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/stakeholders/${id}` : "/api/stakeholders";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");
      router.push("/admin/stakeholders");
    } catch (error) {
      alert("Error saving stakeholder");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {id ? "Edit Stakeholder" : "New Stakeholder"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <Input {...register("name")} placeholder="Full name" />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone
            </label>
            <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Role
            </label>
            <Input
              {...register("role")}
              placeholder="e.g., Board Member, Sponsor"
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Organization
            </label>
            <Input
              {...register("organization")}
              placeholder="Organization name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Department
            </label>
            <Input {...register("department")} placeholder="Department" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Stakeholder"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
