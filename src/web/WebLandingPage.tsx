import Header from "@/web/components/Header";
import HeroSection from "@/web/components/HeroSection";
import FeatureSection from "@/web/components/FeatureSection";
import HowItWorksSection from "@/web/components/HowItWorksSection";
import TestimonialSection from "@/web/components/TestimonialSection";
import ContactSection from "@/web/components/ContactSection";
import Footer from "@/web/components/Footer";

export default function WebLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TestimonialSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
