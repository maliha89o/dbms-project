import { cn } from "@/lib/utils"

function EmptyState({ icon: Icon, title, description, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export { EmptyState }
