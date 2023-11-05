"use client"
import { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import ConfirmModal from "@/components/ConfirmModal"

type BannerProps = {
  documentId: Id<"documents">
}
const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter()
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)
  const onRemove = () => {
    const promise = remove({ id: documentId })
    toast.promise(promise, {
      loading: "Removing Note...",
      success: "Note removed!",
      error: "Failed to remove Note",
    })
    router.push("/docs")
  }
  const onRestore = () => {
    const promise = restore({ id: documentId })
    toast.promise(promise, {
      loading: "Restoring Note...",
      success: "Note restored!",
      error: "Failed to restore Note",
    })
  }
  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p>This page is in the trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white">
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white">
          Remove forever
        </Button>
      </ConfirmModal>
    </div>
  )
}
export default Banner
