"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StudentFormSchema } from "@/lib/validations"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type StudentFormInput = {
  name: string
  email: string
  roll: string
  registration: string
  departmentId: string
  subject: string
  batch: string
  session: string
  gender: string
}

export function StudentForm({ id }: { id?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!id)
  const { data: departments } = useSWR("/api/departments", fetcher)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormInput>({
    resolver: zodResolver(StudentFormSchema),
  })

  useEffect(() => {
    if (id) {
      fetch(`/api/students/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset({
            name: data.userId?.name,
            email: data.userId?.email,
            roll: data.roll,
            registration: data.registration,
            departmentId: data.departmentId?._id,
            subject: data.subject,
            batch: data.batch,
            session: data.session,
            gender: data.gender,
          })
          setIsLoadingData(false)
        })
    }
  }, [id, reset])

  const onSubmit = async (data: StudentFormInput) => {
    setIsLoading(true)
    try {
      const method = id ? "PUT" : "POST"
      const url = id ? `/api/students/${id}` : "/api/students"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save")
      router.push("/admin/students")
    } catch (error) {
      alert("Error saving student")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) return <div className="text-center">Loading...</div>

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">{id ? "Edit Student" : "New Student"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <Input {...register("name")} placeholder="Full name" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input {...register("email")} type="email" placeholder="email@example.com" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Roll Number</label>
            <Input {...register("roll")} placeholder="e.g., 001" />
            {errors.roll && <p className="text-red-500 text-sm mt-1">{errors.roll.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Registration</label>
            <Input {...register("registration")} placeholder="Registration number" />
            {errors.registration && <p className="text-red-500 text-sm mt-1">{errors.registration.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Department</label>
            <select {...register("departmentId")} className="w-full px-3 py-2 border border-input rounded-md text-sm">
              <option value="">Select department</option>
              {departments?.map((dept: any) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="text-red-500 text-sm mt-1">{errors.departmentId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
            <Input {...register("subject")} placeholder="Subject" />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Batch</label>
            <Input {...register("batch")} placeholder="e.g., 2024" />
            {errors.batch && <p className="text-red-500 text-sm mt-1">{errors.batch.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Session</label>
            <Input {...register("session")} placeholder="e.g., Spring 2024" />
            {errors.session && <p className="text-red-500 text-sm mt-1">{errors.session.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
            <select {...register("gender")} className="w-full px-3 py-2 border border-input rounded-md text-sm">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
