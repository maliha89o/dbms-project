import { useEffect, useState } from "react"
import { RefreshCw, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { API_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

const columns = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "age", label: "Age", type: "number" },
  { key: "mobile", label: "Mobile", type: "text" },
  { key: "work", label: "Work", type: "text" },
  { key: "add", label: "Address", type: "text" },
  { key: "decription", label: "Description", type: "text" },
]

const StudentsList = ({ refreshTrigger }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [mutationError, setMutationError] = useState("")

  const fetchStudents = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/students`)
      if (!res.ok) {
        throw new Error("Failed to load students")
      }
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [refreshTrigger])

  const startEdit = (student) => {
    setEditingId(student.id)
    setEditForm({ ...student })
    setMutationError("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (id) => {
    setMutationError("")

    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update student")
      }

      setEditingId(null)
      fetchStudents()
    } catch (err) {
      setMutationError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return

    setMutationError("")

    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      })

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to delete student")
      }

      fetchStudents()
    } catch (err) {
      setMutationError(err.message)
    }
  }

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>All students</CardTitle>
          <CardDescription>
            {loading ? "Loading records…" : `${students.length} record${students.length === 1 ? "" : "s"}`}
          </CardDescription>
        </div>
        <CardAction>
          <Button variant="outline" size="sm" onClick={fetchStudents} disabled={loading}>
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </CardAction>
      </CardHeader>

      {(error || mutationError) && (
        <div className="px-6 pt-4">
          <Alert variant="destructive">
            <AlertDescription>{error || mutationError}</AlertDescription>
          </Alert>
        </div>
      )}

      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !error && students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Students you add above will show up here."
          />
        ) : students.length > 0 ? (
          <div className="animate-in fade-in overflow-x-auto duration-300">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => {
                  const isEditing = editingId === student.id
                  return (
                    <tr key={student.id} className={cn("transition-colors", !isEditing && "hover:bg-muted/30")}>
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                          {isEditing ? (
                            <input
                              name={col.key}
                              type={col.type}
                              value={editForm[col.key] ?? ""}
                              onChange={handleEditChange}
                              className="h-9 w-full min-w-25 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            />
                          ) : (
                            (student[col.key] ?? "-")
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdate(student.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(student)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(student.id)}>
                              Delete
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default StudentsList
