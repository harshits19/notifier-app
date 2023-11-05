"use client"
import CoverImage from "@/components/CoverImage"
import Toolbar from "@/components/Toolbar"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"

type PageProps = {
  params: {
    docId: Id<"documents">
  }
}
const DocIdPage = ({ params: { docId } }: PageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: docId,
  })
  if (document === undefined) return <div>Loading...</div>
  if (document === null) return <div>Not found</div>
  return (
    <div className="pb-40">
      <CoverImage url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}
export default DocIdPage
