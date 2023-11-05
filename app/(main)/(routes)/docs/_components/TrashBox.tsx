"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import Spinner from "@/components/Spinner"
import { Input } from "@/components/ui/input"
import ConfirmModal from "@/components/modals/ConfirmModal"
import { Search, Trash, Undo } from "lucide-react"

const TrashBox = () => {
  const router = useRouter()
  const params = useParams()
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)
  const [search, setSearch] = useState<string>("")
  const filteredDocs = documents?.filter((doc) => {
    return doc.title.toLowerCase().includes(search.toLowerCase())
  })

  const onClick = (documentId: string) => {
    router.push(`/docs/${documentId}`)
  }
  const onRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">,
  ) => {
    e.stopPropagation()
    const promise = restore({ id: documentId })
    toast.promise(promise, {
      loading: "Restoring Note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    })
  }
  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId })
    toast.promise(promise, {
      loading: "Removing Note...",
      success: "Note removed!",
      error: "Failed to remove note.",
    })
    if (params.documentId === documentId) router.push("/docs/")
  }
  if (documents === undefined)
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by note title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden pb-2 text-center text-xs text-muted-foreground last:block">
          No notes found.
        </p>
        {filteredDocs?.map((doc) => (
          <div
            key={doc._id}
            role="button"
            onClick={() => onClick(doc._id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5">
            <span className="truncate pl-2">{doc.title}</span>
            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                role="button"
                onClick={(e) => onRestore(e, doc._id)}>
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(doc._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  onClick={() => {}}>
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default TrashBox
