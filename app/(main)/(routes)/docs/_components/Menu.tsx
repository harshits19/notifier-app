import { Doc } from "@/convex/_generated/dataModel"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Copy, Link, Lock, MoreHorizontal, Trash, Unlock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { calcWords, editedDate } from "@/hooks/useEditInfo"

type MenuProps = {
  document: Doc<"documents">
}
const Menu = ({ document }: MenuProps) => {
  const { user } = useUser()
  const router = useRouter()
  const archive = useMutation(api.documents.archive)
  const update = useMutation(api.documents.update)
  const create = useMutation(api.documents.create)

  const onArchive = () => {
    const promise = archive({ id: document._id })
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note",
    })
    router.push("/docs")
  }
  const onLockNote = () => {
    const promise = update({ id: document._id, isLocked: !document.isLocked })
    toast.promise(promise, {
      loading: "Locking note...",
      success: "Note locked!",
      error: "Failed to lock note",
    })
  }
  const handleCreate = () => {
    const promise = create({
      title: `${document.title} - copy`,
      content: document.content,
      coverImage: document.coverImage,
      icon: document.icon,
      parentDocument: document?.parentDocument,
    }).then((docID) => router.push(`/docs/${docID}`))
    toast.promise(promise, {
      loading: "Creating a duplicate note...",
      success: "Duplicate note created!",
      error: "Failed to create a duplicate note.",
    })
  }
  const onCopy = () => {
    const url = `${origin}/docs/${document._id}`
    navigator.clipboard.writeText(url)
    toast.success("Copied link to clipboard")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="xs" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLockNote}>
          {document.isLocked ? (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              <span>Unlock page</span>
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              <span>Lock page</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCopy}>
          <Link className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex flex-col p-2 text-xs text-muted-foreground">
          {document.content && (
            <span>{"Word count: " + calcWords(document.content)}</span>
          )}
          <span>Last edited by : {user?.fullName}</span>
          <span>{editedDate(document.editTimestamp)}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default Menu

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" />
}
