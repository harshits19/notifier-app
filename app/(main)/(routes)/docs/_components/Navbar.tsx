"use client"

import { MenuIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import Title from "./Title"
import Banner from "./Banner"
import Menu from "./Menu"

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
      <nav className="flex w-full items-center justify-between bg-background px-3 py-2">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
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
        <div className="flex w-full items-center justify-between">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
export default Navbar
