"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useConvexAuth } from "convex/react"
import { SignInButton } from "@clerk/clerk-react"
import Spinner from "@/components/Spinner"
import Link from "next/link"

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <div className="flex max-w-3xl flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
        Your wiki, docs, & projects. Together.
      </h1>
      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        <span className="underline">Notifier</span> is the connected workspace
        where better, faster work happens.
      </h3>
      {isLoading ? (
        <Spinner size="lg" />
      ) : isAuthenticated ? (
        <Button asChild>
          <Link href="/docs">
            Enter Notifier
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button>
            Get Notifier Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  )
}
export default Heading
