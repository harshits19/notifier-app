export const calculateTimeDifference = (unixDate: number): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  const postDate = new Date(unixDate)
  const currentDate = new Date()
  const timeDifferenceMillis = currentDate.getTime() - postDate.getTime()
  const minutesDifference = Math.floor(timeDifferenceMillis / (1000 * 60))
  const hoursDifference = Math.floor(timeDifferenceMillis / (1000 * 60 * 60))
  const daysDifference = Math.floor(
    timeDifferenceMillis / (1000 * 60 * 60 * 24),
  )
  const yearsDifference = Math.floor(daysDifference / 365)
  if (minutesDifference < 60) {
    return `${
      minutesDifference >= 1 ? minutesDifference + "m ago" : "just now"
    }`
  }
  if (hoursDifference < 24) {
    return `${hoursDifference}h ago`
  }
  if (daysDifference < 7) {
    return `${daysDifference}d ago`
  }
  if (yearsDifference < 1) {
    const year = postDate.getFullYear()
    const month = months[postDate.getMonth()]
    const day = postDate.getDate()
    if (year + 1 === currentDate.getFullYear())
      return `${month} ${day}, ${year}`
    return `${month} ${day}`
  }
  return `${yearsDifference > 1 ? yearsDifference + "y" : "a year"} ago`
}

/* const timeDifference = calculateTimeDifference(1700115913000)
console.log(`${timeDifference}`) */
