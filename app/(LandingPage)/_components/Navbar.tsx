"use client"
import useScrollReturn from "@/hooks/useScrollReturn"
import { cn } from "@/lib/utils"
import Logo from "./Logo"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ThemeButton"
import { useConvexAuth } from "convex/react"
import { SignInButton, UserButton } from "@clerk/clerk-react"
import Spinner from "@/components/Spinner"
import Link from "next/link"

const AuthSection = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return isLoading ? (
    <span className="pr-4">
      <Spinner size="lg" />
    </span>
  ) : !isAuthenticated ? (
    <>
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </SignInButton>
      <SignInButton mode="modal">
        <Button size="sm" className="hidden md:block">
          Get Notifier free
        </Button>
      </SignInButton>
    </>
  ) : (
    <>
      <Button variant="ghost" size="sm" className="hidden md:block">
        <Link href="/docs">Enter Notifier</Link>
      </Button>
      <UserButton afterSignOutUrl="/"></UserButton>
    </>
  )
}

const Navbar = () => {
  const scrolled = useScrollReturn()

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex w-full items-center bg-background px-6 py-4",
        scrolled && "border-b shadow-sm",
      )}>
      <Logo />
      <div className="flex w-full items-center justify-end gap-x-1 sm:gap-x-2">
        <AuthSection />
        <ModeToggle />
      </div>
    </nav>
  )
}
export default Navbar
