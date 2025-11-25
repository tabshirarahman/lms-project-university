"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SurveyFormSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

type SurveyFormInput = {
  title: string
  description?: string
  targetGroup?: string
  startDate?: string
  endDate?: string
  visibility: "public" | "internal"
}

export function SurveyForm({ id }: { id?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SurveyFormInput>({
    resolver: zodResolver(SurveyFormSchema),
    defaultValues: { visibility: "internal" },
  })

  useEffect(() => {
    if (id) {
      fetch(`/api/surveys/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset({
            ...data,
            startDate: data.startDate?.split("T")[0],
            endDate: data.endDate?.split("T")[0],
          })
          setIsLoadingData(false)
        })
    }
  }, [id, reset])

  const onSubmit = async (data: SurveyFormInput) => {
    setIsLoading(true)
    try {
      const method = id ? "PUT" : "POST"
      const url = id ? `/api/surveys/${id}` : "/api/surveys"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save")
      router.push(`/admin/surveys`)
    } catch (error) {
      alert("Error saving survey")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) return <div className="text-center">Loading...</div>

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">{id ? "Edit Survey" : "New Survey"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Survey Title</label>
          <Input {...register("title")} placeholder="Survey title" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Survey description"
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
            <Input {...register("startDate")} type="date" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
            <Input {...register("endDate")} type="date" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Target Group</label>
          <Input {...register("targetGroup")} placeholder="e.g., Students, Faculty" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Visibility</label>
          <select {...register("visibility")} className="w-full px-3 py-2 border border-input rounded-md text-sm">
            <option value="internal">Internal</option>
            <option value="public">Public</option>
          </select>
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
