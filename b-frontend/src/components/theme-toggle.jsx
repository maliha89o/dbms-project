import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/use-theme"

const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="relative block size-4">
        <Sun className="absolute inset-0 size-4 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute inset-0 size-4 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
      </span>
    </Button>
  )
}

export default ThemeToggle
