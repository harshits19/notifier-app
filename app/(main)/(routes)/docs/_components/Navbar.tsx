"use client"

import { MenuIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import Title from "./Title"
import Banner from "./Banner"
import Menu from "./Menu"
import Publish from "./Publish"
import { cn } from "@/lib/utils"

type NavbarProps = {
  isCollapsed: boolean
  onResetWidth: () => void
  isMobile: boolean
}
const Navbar = ({ isCollapsed, onResetWidth, isMobile }: NavbarProps) => {
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
      <nav className="flex w-full items-center gap-x-4 bg-background">
        {isCollapsed && (
          <MenuIcon
            className="h-6 w-6 text-muted-foreground ml-3"
            role="button"
            onClick={onResetWidth}
          />
        )}
        <div
          className={cn(
            "flex w-full items-center justify-between px-3 py-2",
            isMobile && !isCollapsed && "hidden",
          )}>
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu document={document} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
export default Navbar
