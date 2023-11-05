"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { useCoverImage } from "@/hooks/useCoverImage"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useEdgeStore } from "@/lib/edgestore"

type CoverImgProps = {
  url?: string
  preview?: boolean
}
const CoverImage = ({ url, preview }: CoverImgProps) => {
  const coverImage = useCoverImage()
  const removeCoverImage = useMutation(api.documents.removeCoverImage)
  const { edgestore } = useEdgeStore()
  const params = useParams()
  const onRemove = async () => {
    if (!url) return
    await edgestore.publicFiles.delete({
      url: url,
    })
    removeCoverImage({ id: params.docId as Id<"documents"> })
  }
  return (
    <div
      className={cn(
        "group relative h-[35vh] w-full",
        !url && "h-[12vh]",
        url && "bg-muted",
      )}>
      {!!url && <Image src={url} fill alt="cover" className="object-cover" />}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
            variant="outline">
            <ImageIcon className="mr-2 h-4 w-4" />
            Change
          </Button>
          <Button
            size="sm"
            onClick={onRemove}
            className="text-xs text-muted-foreground"
            variant="outline">
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}
export default CoverImage
