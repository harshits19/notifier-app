"use client"
import { ElementRef, useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import TextareaAutosize from "react-textarea-autosize"
import IconPicker from "./IconPicker"
import { ImageIcon, Smile, X } from "lucide-react"
import { Button } from "./ui/button"
import { useCoverImage } from "@/hooks/useCoverImage"

type ToolbarProps = {
  initialData: Doc<"documents">
  preview?: boolean
}
const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [value, setValue] = useState(initialData.title)
  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)
  const coverImage = useCoverImage()
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    })
  }
  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    })
  }

  const enableInput = () => {
    if (preview) return
    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }
  const disableInput = () => {
    setIsEditing(false)
  }
  const onInput = (value: string) => {
    setValue(value)
    update({ id: initialData._id, title: value || "Untitled" })
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "enter") {
      e.preventDefault()
      disableInput()
    }
  }

  return (
    <div className="group relative pl-[54px]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-100 md:opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">{initialData.icon}</p>
      )}
      <div className="flex items-center py-4 opacity-70 md:opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-8 rounded-sm px-2">
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-8 rounded-sm px-2">
            <ImageIcon className="mr-2 h-4 w-4" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          placeholder={value}
          onChange={(e) => onInput(e.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-3 text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]">
          {initialData.title}
        </div>
      )}
    </div>
  )
}
export default Toolbar
