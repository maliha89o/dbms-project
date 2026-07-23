import { useEffect, useState } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquareWarning,
  RefreshCw,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import PageHeader from "@/components/PageHeader"
import { API_URL } from "@/lib/api"

const statCards = [
  {
    key: "students",
    label: "Students",
    href: "/students",
    icon: GraduationCap,
    engine: "MySQL",
  },
  {
    key: "courses",
    label: "Courses",
    href: "/courses",
    icon: BookOpen,
    engine: "PostgreSQL",
  },
  {
    key: "complaints",
    label: "Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    engine: "MongoDB",
  },
]

const currency = (value) =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value))

const activityCards = [
  {
    key: "students",
    title: "Recent students",
    description: "Latest registrations",
    emptyIcon: GraduationCap,
    emptyTitle: "No students yet",
    emptyDescription: "New registrations will appear here.",
    render: (student) => (
      <div className="flex w-full items-center justify-between">
        <span className="font-medium text-foreground">{student.name}</span>
        <span className="text-muted-foreground">{student.work || "—"}</span>
      </div>
    ),
    getKey: (student) => student.id,
  },
  {
    key: "courses",
    title: "Recent courses",
    description: "Latest additions",
    emptyIcon: BookOpen,
    emptyTitle: "No courses yet",
    emptyDescription: "New courses will appear here.",
    render: (course) => (
      <div className="flex w-full items-center justify-between">
        <span className="font-medium text-foreground">{course.title}</span>
        <span className="tabular-nums text-muted-foreground">{currency(course.price)}</span>
      </div>
    ),
    getKey: (course) => course.id,
  },
  {
    key: "complaints",
    title: "Recent complaints",
    description: "Latest submissions",
    emptyIcon: MessageSquareWarning,
    emptyTitle: "No complaints yet",
    emptyDescription: "Submissions will appear here.",
    render: (complaint) => (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-foreground">{complaint.subject}</span>
          {complaint.createdAt && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-muted-foreground">{complaint.name || "Anonymous"}</p>
      </div>
    ),
    getKey: (complaint) => complaint._id,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const shouldReduceMotion = useReducedMotion()
  const dur = (value) => (shouldReduceMotion ? 0 : value)

  const fetchStats = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/stats`)
      if (!res.ok) {
        throw new Error("Failed to load dashboard stats")
      }
      const data = await res.json()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      {/* Ambient background motion */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -top-24 -left-32 -z-10 size-72 rounded-full bg-brand/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute top-1/3 -right-24 -z-10 size-80 rounded-full bg-brand/8 blur-3xl"
            animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            aria-hidden="true"
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur(0.4), ease: "easeOut" }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard"
          description="A live snapshot pulled straight from MySQL, PostgreSQL, and MongoDB."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={loading}
          className="transition-shadow duration-200 hover:shadow-md"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stat cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-3"
      >
        {statCards.map(({ key, label, href, icon: Icon, engine }, index) => {
          const data = stats?.[key]
          return (
            <motion.div key={key} variants={fadeUp} className="h-full">
              <motion.div
                className="h-full"
                animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
                transition={{
                  duration: 5 + index * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -6 }}
              >
                <Card className="group relative flex h-full flex-col gap-0 overflow-hidden border-border/80 transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/15">
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand/6 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <CardContent className="relative flex flex-1 flex-col gap-4 p-5">
                    <div className="flex items-start justify-between">
                      <motion.span
                        whileHover={shouldReduceMotion ? {} : { rotate: -6, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </motion.span>
                      <Badge variant="outline" className="text-[10px] tracking-wide text-muted-foreground uppercase">
                        {engine}
                      </Badge>
                    </div>

                    <div>
                      {loading ? (
                        <Skeleton className="h-9 w-16" />
                      ) : (
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.p
                            key={data?.count ?? "empty"}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                            transition={{ duration: dur(0.3), ease: "easeOut" }}
                            className="font-heading text-3xl font-semibold tracking-tight text-foreground tabular-nums"
                          >
                            {data?.count ?? "—"}
                          </motion.p>
                        </AnimatePresence>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                    </div>

                    {key === "courses" && !loading && data && (
                      <p className="text-xs text-muted-foreground">
                        Avg. price <span className="font-medium text-foreground">{currency(data.avgPrice)}</span>
                      </p>
                    )}

                    <Link
                      to={href}
                      className="mt-auto flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      View all
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent activity */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 lg:grid-cols-3"
      >
        {activityCards.map(({ key, title, description, emptyIcon, emptyTitle, emptyDescription, render, getKey }) => {
          const recent = stats?.[key]?.recent
          return (
            <motion.div key={key} variants={fadeUp}>
              <Card className="gap-0 overflow-hidden transition-shadow duration-300 hover:shadow-md">
                <CardHeader>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="space-y-3 p-5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : recent?.length ? (
                    <ul className="divide-y divide-border">
                      {recent.map((item, i) => (
                        <motion.li
                          key={getKey(item)}
                          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: dur(0.3), delay: dur(i * 0.05) }}
                          className="px-5 py-3 text-sm transition-colors duration-150 hover:bg-muted/50"
                        >
                          {render(item)}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default Dashboard
