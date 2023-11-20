import { formatRelative, format } from "date-fns"

export const calcWords = (content: string): number => {
  const cont = JSON.parse(content)
  let str = ""
  cont?.map((obj: any) => {
    if (obj?.content?.length > 0) {
      str += obj.content[0].text + " "
    }
  })
  if (str?.length === 0) return 0
  let n = str?.length
  let spaces = 0
  for (let i = 0; i < n; i++) {
    if (str[i] == " ") spaces = spaces + 1
  }
  return spaces
}
export const editedDate = (editTimestamp: number): string => {
  const editedDate = new Date(editTimestamp)
  const currDate = new Date()
  if (editedDate.getUTCDate() < currDate.getUTCDate())
    return `${format(editedDate, "MMM do, yyyy hh:mm a")}`
  else
    return `${formatRelative(editedDate, currDate).replace(/^./, (match) =>
      match.toUpperCase(),
    )}`
}
