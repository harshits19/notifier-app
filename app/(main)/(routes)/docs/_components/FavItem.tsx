"use client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LucideIcon, MoreHorizontal, Plus, StarOff } from "lucide-react"

type ItemsProps = {
  id?: Id<"documents">
  documentIcon?: string
  active?: boolean
  label: string
  onClick?: () => void
  icon: LucideIcon
}

const FavItem = ({
  id,
  documentIcon,
  active,
  label,
  onClick,
  icon: Icon,
}: ItemsProps) => {
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const update = useMutation(api.documents.update)
  const markUnfav = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = update({ id, isFavorite: false })
    toast.promise(promise, {
      loading: "Removing from favorites...",
      success: "Removed from favorites!",
      error: "Failed to remove from favorites.",
    })
  }
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        router.push(`/docs/${documentId}`)
      },
    )
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    })
  }

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        "group flex min-h-[27px] w-full items-center px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary",
      )}>
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="mr-2 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="ml-auto h-full rounded-sm opacity-100 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600 md:opacity-0">
                <MoreHorizontal className="h-5 w-5 p-[1px] text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount>
              <DropdownMenuItem onClick={markUnfav}>
                <StarOff className="mr-2 h-4 w-4" />
                Remove from Favorites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="ml-auto h-full rounded-sm opacity-100 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600 md:opacity-0"
            role="button"
            onClick={onCreate}>
            <Plus className="h-5 w-5 p-[1px] text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
export default FavItem
