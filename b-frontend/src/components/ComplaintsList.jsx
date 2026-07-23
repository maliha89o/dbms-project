import { useEffect, useState } from "react"
import { Inbox, RefreshCw } from "lucide-react"

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
  { key: "subject", label: "Subject", type: "text" },
  { key: "message", label: "Message", type: "text" },
]

const ComplaintsList = ({ refreshTrigger }) => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [mutationError, setMutationError] = useState("")

  const fetchComplaints = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/complaints`)
      if (!res.ok) {
        throw new Error("Failed to load complaints")
      }
      const data = await res.json()
      setComplaints(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [refreshTrigger])

  const startEdit = (complaint) => {
    setEditingId(complaint._id)
    setEditForm({ ...complaint })
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
      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update complaint")
      }

      setEditingId(null)
      fetchComplaints()
    } catch (err) {
      setMutationError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return

    setMutationError("")

    try {
      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: "DELETE",
      })

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to delete complaint")
      }

      fetchComplaints()
    } catch (err) {
      setMutationError(err.message)
    }
  }

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>All complaints</CardTitle>
          <CardDescription>
            {loading ? "Loading records…" : `${complaints.length} record${complaints.length === 1 ? "" : "s"}`}
          </CardDescription>
        </div>
        <CardAction>
          <Button variant="outline" size="sm" onClick={fetchComplaints} disabled={loading}>
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
        ) : !error && complaints.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No complaints yet"
            description="Complaints submitted above will show up here."
          />
        ) : complaints.length > 0 ? (
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
                {complaints.map((complaint) => {
                  const isEditing = editingId === complaint._id
                  return (
                    <tr key={complaint._id} className={cn("transition-colors", !isEditing && "hover:bg-muted/30")}>
                      {columns.map((col) => (
                        <td key={col.key} className="max-w-xs truncate px-4 py-2.5 text-muted-foreground">
                          {isEditing ? (
                            <input
                              name={col.key}
                              type={col.type}
                              value={editForm[col.key] ?? ""}
                              onChange={handleEditChange}
                              className="h-9 w-full min-w-25 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            />
                          ) : (
                            (complaint[col.key] ?? "-")
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdate(complaint._id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(complaint)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(complaint._id)}>
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

export default ComplaintsList
