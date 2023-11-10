import { useEffect } from "react"
const useSetTitle = (title = "") => {
  useEffect(() => {
    if (!document) return
    const prevTitle = document.title
    document.title = title
    return () => {
      document.title = prevTitle
    }
  })
}
export default useSetTitle
