import { create } from "zustand"
type CoverImgProps = {
  isOpen: boolean
  url?: string
  onOpen: () => void
  onClose: () => void
  onReplace: (url: string) => void
}
export const useCoverImage = create<CoverImgProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url }),
}))
