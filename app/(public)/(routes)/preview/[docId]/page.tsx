"use client"
import { useMemo } from "react"
import dynamic from "next/dynamic"
import CoverImage from "@/components/CoverImage"
import Toolbar from "@/components/Toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"

type PageProps = {
  params: {
    docId: Id<"documents">
  }
}
const DocIdPage = ({ params: { docId } }: PageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    [],
  )
  const document = useQuery(api.documents.getById, {
    documentId: docId,
  })
  if (document === undefined)
    return (
      <div>
        <CoverImage.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    )
  if (document === null) return <div>Not found</div>
  return (
    <div className="pb-40">
      <CoverImage preview url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}
export default DocIdPage
