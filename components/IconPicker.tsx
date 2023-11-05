"use client"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import { Popover } from "./ui/popover"
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"

type IconPickerProps = {
  onChange: (icon: string) => void
  children: React.ReactNode
  asChild?: boolean
}
const IconPicker = ({ onChange, children, asChild }: IconPickerProps) => {
  const { resolvedTheme } = useTheme()
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  }
  const theme = themeMap[currentTheme]

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full border-none p-0 shadow-none z-[99999]">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  )
}
export default IconPicker
