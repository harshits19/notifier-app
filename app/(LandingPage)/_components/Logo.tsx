import Image from "next/image"
const Logo = () => {
  return (
    <div className="flex items-center gap-x-1">
      <Image
        src="/logo.svg"
        height="36"
        width="36"
        className="block dark:hidden"
        alt="logo-light"
      />
      <Image
        src="/logo-dark.svg"
        height="36"
        width="36"
        className="hidden dark:block"
        alt="logo-dark"
      />
      <p className="hidden font-semibold sm:block">Notifier</p>
    </div>
  )
}
export default Logo
