"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DepartmentSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

type DepartmentInput = {
  name: string
  code: string
  description?: string
}

export function DepartmentForm({ id }: { id?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepartmentInput>({
    resolver: zodResolver(DepartmentSchema),
  })

  useEffect(() => {
    if (id) {
      fetch(`/api/departments/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset(data)
          setIsLoadingData(false)
        })
    }
  }, [id, reset])

  const onSubmit = async (data: DepartmentInput) => {
    setIsLoading(true)
    try {
      const method = id ? "PUT" : "POST"
      const url = id ? `/api/departments/${id}` : "/api/departments"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save")
      router.push("/admin/departments")
    } catch (error) {
      alert("Error saving department")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) return <div className="text-center">Loading...</div>

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">{id ? "Edit Department" : "New Department"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Department Name</label>
          <Input {...register("name")} placeholder="e.g., Computer Science" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Department Code</label>
          <Input {...register("code")} placeholder="e.g., CS" />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Department description"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
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
