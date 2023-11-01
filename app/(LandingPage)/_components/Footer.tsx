import { Button } from "@/components/ui/button"
import Logo from "./Logo"

const Footer = () => {
  return (
    <div className="z-50 flex items-center justify-start bg-background p-4">
      <Logo />
      <div className="flex w-full justify-end sm:gap-x-2">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  )
}
export default Footer
