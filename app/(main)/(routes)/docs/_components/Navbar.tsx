"use client"

import { MenuIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import Spinner from "@/components/Spinner"
import Title from "./Title"

type NavbarProps = {
  isCollapsed: boolean
  onResetWidth: () => void
}
const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.docId as Id<"documents">,
  })
  if (document === undefined)
    return (
      <nav className="flex w-full items-center bg-background px-3 py-2">
        <Title.Skeleton />
      </nav>
    )
  if (document === null) return null
  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2">
        {isCollapsed && (
          <MenuIcon
            className="h-6 w-6 text-muted-foreground"
            role="button"
            onClick={onResetWidth}
          />
        )}
        <Title initialData={document} />
      </nav>
    </>
  )
}
export default Navbar
