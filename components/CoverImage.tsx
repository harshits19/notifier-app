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
import { Skeleton } from "./ui/skeleton"

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
        "group relative h-[30vh] w-full",
        !url && "h-[12vh]",
        url && "mt-12 bg-muted",
      )}>
      {!!url && (
        <Image
          src={url}
          alt="cover"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      {!!url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-80 group-hover:opacity-100 md:opacity-0">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="h-7 rounded-sm px-2 text-xs text-muted-foreground"
            variant="outline">
            <ImageIcon className="mr-2 h-4 w-4" />
            Change
          </Button>
          <Button
            onClick={onRemove}
            className="h-7 rounded-sm px-2 text-xs text-muted-foreground"
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

CoverImage.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />
}
