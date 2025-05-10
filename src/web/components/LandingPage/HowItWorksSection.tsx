import { useState } from "react"
import VideoThumbnail from "@/assets/webappimage/LandingPage/VideoThumbnail.jpg"
import HeirkeyVideo from "@/assets/heirkeyvideo/HeirkeyVideo.mp4"

export default function HowItWorksSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-white py-16 px-4 md:px-8 lg:px-16 space-y-16">
      <div className="max-w-5xl mx-auto text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          How Heirkey can Help Your Family.
        </h2>
        <h3 className="text-md font-bold text-gray-600 mb-4">
          We help you store the valuable information that otherwise might be lost to your family.
        </h3>
        <p className="text-gray-700 ">
          When a parent or a loved one passes away, you are immediately struck with many tasks.
          People spend hours, days, and sometimes even months searching for all the necessary
          information. Heirkey is a digital organizational website for you and your heirs. Think of
          it as a digital safety deposit box for you and your family. With Heirkey, you can protect
          your family from unnecessary stress, all while protecting your legacy.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-7">Why Heirkey</h3>
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
          {!isPlaying ? (
            <>
              <img
                onClick={() => setIsPlaying(true)}
                src={VideoThumbnail}
                alt="Why Heirkey"
                className="w-full h-auto object-cover"
              />
            </>
          ) : (
            <video
              src={HeirkeyVideo}
              controls
              autoPlay
              className="w-full h-auto object-cover"
            />
          )}
        </div>
      </div>
    </div>
  )
}
