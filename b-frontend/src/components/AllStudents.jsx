import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { RefreshCw, Users, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import { API_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import PageHeader from "@/components/PageHeader"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const AllStudents = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const shouldReduceMotion = useReducedMotion()

  const fetchUsers = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/users`)
      if (!res.ok) {
        throw new Error("Failed to load students")
      }
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          icon={Users}
          title="All Students"
          description="Everyone who has signed in, pulled straight from MongoDB."
        />
        <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : !error && users.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Once someone logs in, they'll show up here automatically."
          />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {users.map((user, index) => (
            <motion.div key={user._id} variants={cardVariants} className="h-full">
              <motion.div
                className="h-full"
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{
                  duration: 5 + (index % 4) * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (index % 5) * 0.3,
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -8 }}
              >
                <div className="group relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/15">
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand/6 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <motion.span
                    whileHover={shouldReduceMotion ? {} : { rotate: -4, scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground ring-2 ring-border"
                  >
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.name || "Student"}
                        className="size-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <UserRound className={cn("size-8", user.imageUrl && "hidden")} aria-hidden="true" />
                  </motion.span>

                  <div className="relative">
                    <p className="font-heading font-semibold tracking-tight text-foreground">
                      {user.name || "Unnamed student"}
                    </p>
                    {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default AllStudents
