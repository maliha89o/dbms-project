const PageHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    {Icon && (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
    )}
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  </div>
)

export default PageHeader
