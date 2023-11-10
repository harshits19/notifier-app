import { useParams, useRouter } from "next/navigation"
import { Doc } from "@/convex/_generated/dataModel"
import FavItem from "./FavItem"
import { FileIcon } from "lucide-react"

const Favorites = ({
  documents,
}: {
  documents: Doc<"documents">[] | undefined
}) => {
  if (!documents) return
  const router = useRouter()
  const params = useParams()
  const onRedirect = (documentId: string) => {
    router.push(`/docs/${documentId}`)
  }
  return (
    <div>
      {documents.length > 0 && (
        <p className="px-4 py-2 text-xs font-medium text-muted-foreground/70">
          Favorites
        </p>
      )}
      {documents?.map((doc) => (
        <div key={doc._id}>
          <FavItem
            documentIcon={doc.icon}
            id={doc._id}
            onClick={() => onRedirect(doc._id)}
            label={doc.title}
            icon={FileIcon}
            active={params.docId === doc._id}
          />
        </div>
      ))}
    </div>
  )
}
export default Favorites
