import Spinner from "@/components/Spinner"

const loading = () => {
  return <div className="flex h-full w-full items-center justify-center">
    <Spinner size="icon" />
  </div>
}
export default loading
