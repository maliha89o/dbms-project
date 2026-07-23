import { useId } from "react"

import { cn } from "@/lib/utils"

const LogoMark = ({ className }) => {
  const gradientId = useId()

  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <rect x="7" y="18" width="4" height="8" rx="1.5" fill="#fff" fillOpacity="0.55" />
      <rect x="14" y="13" width="4" height="13" rx="1.5" fill="#fff" fillOpacity="0.8" />
      <rect x="21" y="8" width="4" height="18" rx="1.5" fill="#fff" />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const Logo = ({ className, iconClassName, wordmarkClassName, showWordmark = true }) => (
  <span className={cn("flex items-center gap-2", className)}>
    <LogoMark className={iconClassName} />
    {showWordmark && (
      <span className={cn("text-base font-semibold tracking-tight text-foreground", wordmarkClassName)}>
        SDS
      </span>
    )}
  </span>
)

export { LogoMark }
export default Logo
