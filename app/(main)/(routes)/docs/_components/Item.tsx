import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { editedDate } from "@/hooks/useEditInfo"
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Copy,
  LinkIcon,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Star,
  StarOff,
  Trash,
} from "lucide-react"

type ItemProps = {
  id?: Id<"documents"> /* Id of parent note is provided while creating a children note */
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  label: string
  onClick?: () => void
  icon: LucideIcon
  isFavorite?: boolean
  editTimestamp?: number
  coverImage?: string
  content?: string
  parentDocument?: Id<"documents">
}
const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  label,
  onClick,
  icon: Icon,
  isFavorite,
  editTimestamp,
  coverImage,
  content,
  parentDocument,
}: ItemProps) => {
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    onExpand?.()
  }

  const { user } = useUser()
  const router = useRouter()
  const create = useMutation(api.documents.create) //subscribing to create and archive methods in documents api
  const archive = useMutation(api.documents.archive)
  const update = useMutation(api.documents.update)
  const markfav = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = update({ id, isFavorite: !isFavorite })
    toast.promise(promise, {
      loading: isFavorite
        ? "Removing from favorites..."
        : "Adding to favorites...",
      success: isFavorite ? "Removed from favorites!" : "Added to favorites!",
      error: isFavorite
        ? "Failed to remove from favorites."
        : "Failed to add to favorites.",
    })
  }
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    /* fn for creating a child user */
    event.stopPropagation()
    if (!id) return
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.()
        }
        router.push(`/docs/${documentId}`)
      },
    )
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    })
  }
  /* fn for archiving current doc(with children), id of parent must be passed */
  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = archive({ id }).then(() => {
      router.push(`/docs`)
    }) /* logic behind- mark archieved status to false in database entry of note */
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    })
  }
  const handleCreate = () => {
    const promise = create({
      title: `${document.title} - copy`,
      content: content,
      coverImage: coverImage,
      icon: documentIcon,
      parentDocument: parentDocument,
    }).then((docID) => router.push(`/docs/${docID}`))
    toast.promise(promise, {
      loading: "Creating a duplicate note...",
      success: "Duplicate note created!",
      error: "Failed to create a duplicate note.",
    })
  }
  const onCopy = () => {
    const url = `${origin}/docs/${id}`
    navigator.clipboard.writeText(url)
    toast.success("Copied link to clipboard")
  }
  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  const FavoriteIcon = isFavorite ? StarOff : Star

  /* id = string
!id => boolean (if id is present then !id = false)
!!id => !(false) => !!id = true
hence !!id = Boolean(id) = true (if id is present)
*/
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group flex min-h-[27px]  w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary",
      )}>
      {!!id /* to handle child notes dropdown */ && (
        <div
          role="button"
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="mr-2 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-[10px] leading-4">⌘</span>K
        </kbd>
      )}
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
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={markfav}>
                <FavoriteIcon className="mr-2 h-4 w-4" />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  className="contents"
                  href={`${origin}/docs/${id}`}
                  target="_blank">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Open in new tab
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopy}>
                <LinkIcon className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex flex-col p-2 text-xs text-muted-foreground">
                <span>Last edited by : {user?.fullName}</span>
                {editTimestamp && <span>{editedDate(editTimestamp)}</span>}
              </div>
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

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}

export default Item
