import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Splash from "@/assets/webappimage/AuthImages/Splash.jpg"
import LandingHeader from "@/web/components/Layout/LandingHeader";
import Footer from "@/web/components/Layout/Footer";

export default function WebSplashPage() {
  return (
    <>
      <LandingHeader />
      <section className="bg-white px-6 py-20 md:px-28 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2 max-w-xl">
          <h1 className="text-4xl md:text-4xl font-semibold text-gray-900 mb-6 leading-snug">
            Protect your legacy, <br />
            get started in just 5 minutes.
          </h1>

          <ul className="space-y-4 mb-8 text-gray-700 text-lg">
            {[
              "30-day free trial",
              "Personalized onboarding",
              "Access to all features",
            ].map((text) => (
              <li key={text} className="flex items-center gap-3">
                <CheckCircle className="text-teal-500 w-6 h-6" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="outline" className="text-sm px-6 py-2">
              Learn more
            </Button>
            <Link to="/auth/register">
              <Button className="bg-[#2BCFD5] hover:bg-[#25b6ba] text-white text-sm px-6 py-2">
                Get started
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center pt-10">
          <img
            src={Splash}
            alt="Legacy protection"
            className="object-cover w-full max-w-md h-auto shadow-xl"
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
