"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useCoverImage } from "@/hooks/useCoverImage"
import { SingleImageDropzone } from "../ImageDropbox"
import { useEdgeStore } from "@/lib/edgestore"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"

const CoverImageModal = () => {
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const update = useMutation(api.documents.update)

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams()

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }
  const onChange = async (file?: File) => {
    if (!file) return
    setIsSubmitting(true)
    setFile(file)
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      })
      update({
        id: params.docId as Id<"documents">,
        coverImage: res.url,
      })
    } catch (err) {
      toast.error("Error uploading image. The file size may be too large.")
    }
    onClose()
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
        <p className="text-xs text-muted-foreground">File size limit: 1 mb</p>
      </DialogContent>
    </Dialog>
  )
}
export default CoverImageModal
