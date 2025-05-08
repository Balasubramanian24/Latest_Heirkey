import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Splash from "@/assets/webappimage/AuthImages/Splash.jpg"
import Header from "../LandingPage/Header";
import Footer from "../LandingPage/Footer";

export default function SplashPage() {
  return (
    <>
    <Header />
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-16 md:px-20 bg-white">
        {/* Left: Text Content */}
        <div className="max-w-lg mb-12 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Protect your legacy,<br />
            get started in just 5 minutes.
          </h1>

          <ul className="space-y-4 mb-8 text-gray-700">
            {[
              "30-day free trial",
              "Peronalized onboarding",
              "Access to all features",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2">
                <CheckCircle className="text-teal-500 w-8 h-8" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="outline">Learn more</Button>
            <Button className="bg-[#2BCFD5] text-white hover:bg-[#25b6ba]">Get started</Button>
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/2">
          <img
            src={Splash} // Replace with actual import or public URL
            alt="Legacy protection"
            className="w-full h-auto rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
