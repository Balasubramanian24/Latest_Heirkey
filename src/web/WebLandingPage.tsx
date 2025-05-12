import LandingHeader from "@/web/components/Layout/LandingHeader";
import HeroSection from "@/web/pages/LandingPage/HeroSection";
import FeatureSection from "@/web/pages/LandingPage/FeatureSection";
import HowItWorksSection from "@/web/pages/LandingPage/HowItWorksSection";
import TestimonialSection from "@/web/pages/LandingPage/TestimonialSection";
import ContactSection from "@/web/pages/LandingPage/ContactSection";
import Footer from "@/web/components/Layout/Footer";

export default function WebLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TestimonialSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
