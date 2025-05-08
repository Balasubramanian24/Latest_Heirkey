import Contact from "@/assets/webappimage/LandingPage/Contact.jpg";
import { Star } from "lucide-react";

export default function TestimonialAndStatsSection() {
  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12">
        <img
          src={Contact}
          alt="Testimonial"
          className="w-40 h-40 rounded-lg object-cover"
        />
        <div className="text-left">
          <div className="flex items-center space-x-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-gray-800 text-lg mb-2">
            When my father passed away, I could not find any of the information I needed. I wish
            there was a product like Heirkey to help me during that difficult time.
          </p>
          <p className="text-sm font-semibold text-gray-900">— Angelina</p>
          <p className="text-sm text-gray-500">Oakland CA</p>
        </div>
      </div>

      <div className="max-w-full bg-[#1F4168] flex justify-center items-center h-72">
      <div className="border-y border-white/80 py-10 px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="py-2">
          <p className="text-5xl font-bold text-white p-5">32%</p>
          <p className="text-sm text-white">of Americans have a will</p>
        </div>
        <div className="py-2">
          <p className="text-5xl font-bold text-white p-5">46%</p>
          <p className="text-sm text-white">of will executors were aware of a will</p>
        </div>
        <div className="py-2">
          <p className="text-5xl font-bold text-white p-5">52%</p>
          <p className="text-sm text-white flex justify-center flex-nowrap">don’t know where their parents store estate planning documents</p>
        </div>
      </div>
      </div>
    </div>
  );
}
