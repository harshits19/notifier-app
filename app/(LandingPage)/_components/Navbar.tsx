"use client"
import useScrollReturn from "@/hooks/useScrollReturn"
import { cn } from "@/lib/utils"
import Logo from "./Logo"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ThemeButton"

const Navbar = () => {
  const scrolled = useScrollReturn()
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex w-full items-center bg-background p-6",
        scrolled && "border-b shadow-sm",
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-end sm:gap-x-2">
        <Button variant="ghost" size="sm">
          Login
        </Button>
        <Button variant="default" size="sm" className="md:block hidden">
          Get Notifier free
        </Button>
        <ModeToggle />
      </div>
    </nav>
  )
}
export default Navbar
