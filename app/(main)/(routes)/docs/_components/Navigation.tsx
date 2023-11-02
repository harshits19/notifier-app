import { useState, useRef, ElementRef, useEffect } from "react"
import { ChevronsLeft, MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "usehooks-ts"
import { cn } from "@/lib/utils"

const Navigation = () => {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width:768px)") //detect mobile device
  const isResizingRef = useRef<boolean>(false) //to get resizing state of sidebar
  const sidebarRef = useRef<ElementRef<"aside">>(null)
  const navbarRef = useRef<ElementRef<"div">>(null)
  const [isResetting, setIsResetting] = useState<boolean>(false) //state while resetting the sidebar width(to show animations)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile) //state of sidebar

  useEffect(() => {
    if (isMobile) collapseSidebar()
    else resetWidth()
  }, [isMobile])
  useEffect(() => {
    if (isMobile) collapseSidebar()
  }, [pathname,isMobile])

  const handleSidebarResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    isResizingRef.current = true //set resizing state true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return //if resizing state false then return
    let newWidth = e.clientX //distance(x-axis) of cursor moved from current position horizontally
    if (newWidth < 240) newWidth = 240 //set min 240px
    if (newWidth > 400) newWidth = 400 //set max 400px
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px` //set width by taking distance of cursor moved
      // navbarRef.current.style.setProperty("left", `${newWidth}px`) //move navbar along with sidebar
      navbarRef.current.style.left = `${newWidth}px` //alt
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`) //adjust navbar width to fit in screen size
    }
  }
  const handleMouseUp = () => {
    isResizingRef.current = false //set resizing state false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true) //to add animation
      setIsCollapsed(false)
      const newWidth = isMobile ? "100%" : "240px"
      sidebarRef.current.style.width = newWidth
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0px" : "calc(100% - 240px)",
      )
      navbarRef.current.style.setProperty("left", newWidth)
      setTimeout(() => setIsResetting(false), 300) //to remove animation after 300ms
    }
  }
  const collapseSidebar = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true)
      setIsCollapsed(true)
      sidebarRef.current.style.width = "0px"
      navbarRef.current.style.setProperty("width", "0px")
      navbarRef.current.style.setProperty("left", "0px")
      setTimeout(() => setIsResetting(false), 300) //to remove animation after 300ms
    }
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[9999] flex h-full w-60 flex-col overflow-y-auto bg-secondary",
          isResetting &&
            "transition-all ease-in-out" /* adding animation when resetting state is true(while resetting sidebar width) */,
          isMobile && "w-0",
        )}>
        <button
          className={cn(
            "absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100",
          )}
          title="Close sidebar"
          onClick={collapseSidebar}>
          <ChevronsLeft className="h-6 w-6" />
        </button>
        <div>Action Items</div>
        <div>Documents</div>
        <div
          onMouseDown={handleSidebarResize}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"></div>
      </aside>
      <div
        className={cn(
          "absolute left-60 top-0 z-[9999] w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full",
        )}
        ref={navbarRef}>
        <nav className="w-full bg-transparent px-3 py-2">
          {isCollapsed && (
            <MenuIcon
              className="h-6 w-6 text-muted-foreground"
              role="button"
              onClick={resetWidth}
            /> //only show this btn when sidebar is collapsed
          )}
        </nav>
      </div>
    </>
  )
}
export default Navigation
