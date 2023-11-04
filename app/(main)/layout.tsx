"use client"

import Spinner from "@/components/Spinner"
import { useConvexAuth } from "convex/react"
import { redirect } from "next/navigation"
import Navigation from "./(routes)/docs/_components/Navigation"
import SearchCommand from "@/components/SearchCommand"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading)
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner size="icon" />
      </div>
    )

  if (!isAuthenticated) return redirect("/")

  return (
    <div className="flex h-full">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}
export default MainLayout
