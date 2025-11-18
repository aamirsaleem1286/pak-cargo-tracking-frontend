import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
// import AboutSection from "@/components/AboutSection";
// import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      {/* <AboutSection /> */}
      {/* <ContactSection /> */}
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default Index;
