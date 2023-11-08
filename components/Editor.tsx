"use client"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView, useBlockNote } from "@blocknote/react"
import "@blocknote/core/style.css"
import { useTheme } from "next-themes"
import { useEdgeStore } from "@/lib/edgestore"

type EditorProps = {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}
const Editor = ({ initialContent, editable, onChange }: EditorProps) => {
  const { edgestore } = useEdgeStore()
  const handleImgUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file })
    return res.url
  }
  const { resolvedTheme } = useTheme() //should be dark or light only
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleImgUpload,
  })
  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}
export default Editor
