import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  style: "normal",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: "",
    default: "Notifier",
  },
  description: "Notifier, notifies you to take notes!",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
export default RootLayout
