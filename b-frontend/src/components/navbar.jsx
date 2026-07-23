import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ThemeToggle from "@/components/theme-toggle"
import Logo from "@/components/Logo"
import useAuth from "@/hooks/useAuth"

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Add Students", to: "/students" },
  { label: "All Students", to: "/all-students" },
  { label: "Complaints", to: "/complaints" },
  { label: "Courses", to: "/courses" },
]


const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  const handleLogOut = () => {
    logOut()
    setOpen(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px origin-center scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100",
                      isActive && "scale-x-100"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-1 hidden h-6 md:block" />
          {user ? (
            <Button variant="ghost" className="hidden md:inline-flex" onClick={handleLogOut}>
              Log out
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              nativeButton={false}
              render={<Link to="/login" />}
            >
              Log in
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <SheetHeader className="flex-row items-center justify-between">
                <SheetTitle className="text-left">SDS</SheetTitle>
                <ThemeToggle className="mr-6" />
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        isActive && "bg-muted text-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <Separator className="mx-4 my-2 w-auto" />
              <div className="flex flex-col gap-2 px-4">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleLogOut}>
                    Log out
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    nativeButton={false}
                    render={<Link to="/login" />}
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
