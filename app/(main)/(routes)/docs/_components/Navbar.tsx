"use client"

import { useParams } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import Title from "@/app/(main)/(routes)/docs/_components/Title"
import Banner from "@/app/(main)/(routes)/docs/_components/Banner"
import Menu from "@/app/(main)/(routes)/docs/_components/Menu"
import Publish from "@/app/(main)/(routes)/docs/_components/Publish"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MenuIcon, Star } from "lucide-react"
import { calculateTimeDifference } from "@/hooks/useDistanceDate"

type NavbarProps = {
  isCollapsed: boolean
  onResetWidth: () => void
  isMobile: boolean
}

const FavBtn = ({ document }: { document: Doc<"documents"> }) => {
  const update = useMutation(api.documents.update)
  const markFav = (docId: Id<"documents">) => {
    const promise = update({ id: docId, isFavorite: !document.isFavorite })
    toast.promise(promise, {
      loading: document.isFavorite
        ? "Removing from favorites..."
        : "Adding to favorites...",
      success: document.isFavorite
        ? "Removed from favorites!"
        : "Added to favorites!",
      error: document.isFavorite
        ? "Failed to remove from favorites."
        : "Failed to add to favorites.",
    })
  }
  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => markFav(document._id)}
      title={
        document.isFavorite
          ? "Remove from your favorites"
          : "Add to your favorites"
      }>
      <Star
        className={cn(
          "h-[18px] w-[18px]",
          document.isFavorite && "fill-yellow-500 text-yellow-500",
        )}
      />
    </Button>
  )
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
            className="ml-3 h-6 w-6 text-muted-foreground"
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
            {document.editTimestamp !== 0 && (
              <div className="hidden text-sm text-muted-foreground/70 md:block">
                {`Edited 
                ${calculateTimeDifference(document.editTimestamp)}`}
              </div>
            )}
            <Publish initialData={document} />
            <FavBtn document={document} />
            <Menu document={document} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentData={document} />}
    </>
  )
}
export default Navbar
