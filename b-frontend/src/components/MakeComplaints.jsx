import { useState } from "react"
import { MessageSquareWarning } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import PageHeader from "@/components/PageHeader"
import ComplaintsList from "@/components/ComplaintsList"
import { API_URL } from "@/lib/api"

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

const MakeComplaints = () => {
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
      const res = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus({ type: "success", message: "Complaint submitted successfully! FromMongoDB" })
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
        icon={MessageSquareWarning}
        title="Complaints"
        description="Submit and track complaints, backed by MongoDB."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Make a complaint</CardTitle>
            <CardDescription>Fill in the details below to submit a complaint.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" required>
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" required>
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {status.type && (
              <Alert variant={status.type === "success" ? "success" : "destructive"}>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ComplaintsList refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default MakeComplaints
