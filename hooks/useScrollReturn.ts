import { useState, useEffect } from "react"
const useScrollReturn = (threshold: number = 10): boolean => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) setScrolled(true)
      else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  return scrolled
}
export default useScrollReturn
