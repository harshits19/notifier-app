import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { Loader } from "lucide-react"
//custom spinner
//define variants
const SpinnerVariants = cva(
  "text-muted-foreground animate-spin" /* default class */,
  {
    variants: {
      size: {
        /* name of variants */ default: "h-4 w-4",
        sm: "h-2 w-2",
        lg: "h-6 w-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      size: "default" /* default properties of variants */,
    },
  },
)
//defining type of Component
// interface SpinnerProps extends VariantProps<typeof SpinnerVariants> {}
type SpinnerProps = VariantProps<typeof SpinnerVariants>

const Spinner = ({ size }: SpinnerProps) => {
  return <Loader className={cn(SpinnerVariants({ size }))} />
}
export default Spinner
