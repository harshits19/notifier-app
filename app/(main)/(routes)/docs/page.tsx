"use client"
import Image from "next/image"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const DocsPage = () => {
  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const router = useRouter()

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((docId) =>
      router.push(`/docs/${docId}`),
    )
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        className="dark:hidden"
        alt="Empty doc"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        className="hidden dark:block"
        alt="Empty doc"
      />
      <h2 className="pb-2 text-xl font-semibold">
        Welcome! {user?.firstName} to Notifier
      </h2>
      <Button size="sm" onClick={onCreate}>
        <PlusCircleIcon className="mr-2 h-4 w-4" /> Create a note
      </Button>
    </div>
  )
}
export default DocsPage
