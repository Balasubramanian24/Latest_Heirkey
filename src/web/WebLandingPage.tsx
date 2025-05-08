import Header from "@/web/components/LandingPage/Header";
import HeroSection from "@/web/components/LandingPage/HeroSection";
import FeatureSection from "@/web/components/LandingPage/FeatureSection";
import HowItWorksSection from "@/web/components/LandingPage/HowItWorksSection";
import TestimonialSection from "@/web/components/LandingPage/TestimonialSection";
import ContactSection from "@/web/components/LandingPage/ContactSection";
import Footer from "@/web/components/LandingPage/Footer";

export default function WebLandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TestimonialSection />
      <ContactSection />

      <Footer />
    </main>
  );
}
