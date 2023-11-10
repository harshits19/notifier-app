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
import { MoreHorizontal, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type MenuProps = {
  document: Doc<"documents">
}
const Menu = ({ document }: MenuProps) => {
  const { user } = useUser()
  const router = useRouter()
  const archive = useMutation(api.documents.archive)
  const onArchive = () => {
    const promise = archive({ id: document._id })
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note",
    })
    router.push("/docs")
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
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by : {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default Menu

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" />
}
