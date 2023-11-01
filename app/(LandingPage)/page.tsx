import Footer from "./_components/Footer"
import FrontSection from "./_components/FrontSection"
import Heading from "./_components/Heading"

const LandingPage = () => {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start">
        <Heading />
        <FrontSection />
      </div>
      <Footer />
    </div>
  )
}
export default LandingPage
