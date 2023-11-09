"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import ConfirmModal from "@/components/modals/ConfirmModal"
import { useEdgeStore } from "@/lib/edgestore"

type BannerProps = {
  documentData: Doc<"documents">
}
const Banner = ({ documentData }: BannerProps) => {
  const router = useRouter()
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)
  const { edgestore } = useEdgeStore()
  const removeCoverFromStore = async (url: string) => {
    if (!url) return
    await edgestore.publicFiles.delete({
      url: url,
    })
  }
  const onRemove = () => {
    if (documentData.coverImage) removeCoverFromStore(documentData.coverImage) //to make sure cover image is deleted from edge store
    const promise = remove({ id: documentData._id })
    toast.promise(promise, {
      loading: "Removing Note...",
      success: "Note removed!",
      error: "Failed to remove Note",
    })
    router.push("/docs")
  }
  const onRestore = () => {
    const promise = restore({ id: documentData._id })
    toast.promise(promise, {
      loading: "Restoring Note...",
      success: "Note restored!",
      error: "Failed to restore Note",
    })
  }
  return (
    <div className="z-[1000] flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
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
