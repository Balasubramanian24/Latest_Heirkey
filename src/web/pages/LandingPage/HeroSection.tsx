import { Button } from "@/components/ui/button"
import { CirclePlay } from "lucide-react"
import Hero from "@/assets/webappimage/LandingPage/Hero.jpg"

export default function HeroSection() {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Hero})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Heirkey</h1>
        <h2 className="text-2xl md:text-4xl font-medium mb-4">Lock In your Legacy.</h2>
        <p className="max-w-xl text-lg md:text-xl mb-8">
          Heirkey is a digital organizational tool for you and your heirs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="bg-white text-black hover:bg-gray-100 w-40">
            <CirclePlay className="inline-block mr-1 w-5 h-5" /> Demo
          </Button>
          <Button className="bg-[#2BCFD5] hover:bg-[#2BCFD5] w-40">Sign up</Button>
        </div>
      </div>
    </div>
  )
}
