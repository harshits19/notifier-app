"use client"

import { Doc } from "@/convex/_generated/dataModel"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/useOrigin"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, Copy, Globe } from "lucide-react"

type PublishProps = {
  initialData: Doc<"documents">
}
const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `${origin}/preview/${initialData._id}`
  const onPublish = () => {
    setIsSubmitting(true)
    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => setIsSubmitting(false),
    )
    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published!",
      error: "Failed to publish note.",
    })
  }
  const onUnpublish = () => {
    setIsSubmitting(true)
    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => setIsSubmitting(false),
    )
    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Note unpublished!",
      error: "Failed to unpublish note.",
    })
  }
  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="ml-2 h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This note os live on web
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs outline-none"
                value={url}
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              onClick={onUnpublish}
              disabled={isSubmitting}>
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Publish this note</p>
            <span className="mb-4 text-xs text-muted-foreground">
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              size="sm"
              className="w-full text-xs">
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
export default Publish