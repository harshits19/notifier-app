"use client"

import { Doc, Id } from "@/convex/_generated/dataModel"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Item from "./Item"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"

type DocListProps = {
  parentDocumentId?: Id<"documents">
  level?: number
  data?: Doc<"documents">
}
const DocumentList = ({ parentDocumentId, level = 0 }: DocListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({ ...prev, [documentId]: !prev[documentId] }))
  }
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  })
  const onRedirect = (documentId: string) => {
    router.push(`/docs/${documentId}`)
  }
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }
  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden" /* only display when there's no children */,
        )}>
        No pages inside
      </p>
      {/* render documents */}
      {documents.map((doc) => (
        <div key={doc._id}>
          <Item
            id={doc._id}
            onClick={() => onRedirect(doc._id)}
            label={doc.title}
            documentIcon={doc.icon}
            icon={FileIcon}
            active={params.docId === doc._id}
            level={level}
            onExpand={() => onExpand(doc._id)}
            expanded={expanded[doc._id]}
            isFavorite={doc.isFavorite}
          />
          {/* recalling documentlist component and passing prop of parentDocId to render children */}
          {expanded[doc._id] && (
            <DocumentList parentDocumentId={doc._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}
export default DocumentList
