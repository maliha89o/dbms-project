import { useState } from "react"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import PageHeader from "@/components/PageHeader"
import CoursesList from "@/components/CoursesList"
import { API_URL } from "@/lib/api"

const initialForm = {
  title: "",
  description: "",
  price: "",
  instructor: "",
}

const Courses = () => {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: null, message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      const res = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus({ type: "success", message: "Course added successfully! From PostgreSQL" })
      setForm(initialForm)
      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      setStatus({ type: "error", message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        icon={BookOpen}
        title="Courses"
        description="Add new courses and manage the catalog, backed by PostgreSQL."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Add course</CardTitle>
            <CardDescription>Fill in the details below to add a new course.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="title" required>
                Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  type="text"
                  value={form.instructor}
                  onChange={handleChange}
                />
              </div>
            </div>

            {status.type && (
              <Alert variant={status.type === "success" ? "success" : "destructive"}>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Submitting..." : "Add Course"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <CoursesList refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default Courses
