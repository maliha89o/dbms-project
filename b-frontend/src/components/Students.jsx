import { useState } from "react"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import PageHeader from "@/components/PageHeader"
import StudentsList from "@/components/StudentsList"
import { API_URL } from "@/lib/api"

const initialForm = {
  name: "",
  email: "",
  age: "",
  mobile: "",
  work: "",
  add: "",
  decription: "",
}

const fields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email" },
  { name: "age", label: "Age", type: "number" },
  { name: "mobile", label: "Mobile", type: "text" },
  { name: "work", label: "Work", type: "text" },
  { name: "add", label: "Address", type: "text" },
]

const Students = () => {
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
      const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus({ type: "success", message: "Student added successfully! From MySQL" })
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
        icon={GraduationCap}
        title="Students"
        description="Register new students and manage existing records, backed by MySQL."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Add student</CardTitle>
            <CardDescription>Fill in the details below to register a new student.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name} required={field.required}>
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="decription">Description</Label>
              <Textarea
                id="decription"
                name="decription"
                rows={4}
                value={form.decription}
                onChange={handleChange}
              />
            </div>

            {status.type && (
              <Alert variant={status.type === "success" ? "success" : "destructive"}>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Submitting..." : "Add Student"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <StudentsList refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default Students
