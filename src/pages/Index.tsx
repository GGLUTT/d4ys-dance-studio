import { useState } from "react";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageTransition } from "@/components/PageTransition";
import { HeroSection } from "@/components/sections/HeroSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { DirectionsSection } from "@/components/sections/DirectionsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FooterSection } from "@/components/sections/FooterSection";

const navItems = [
  { name: "Home", link: "#home" },
  { name: "Gallery", link: "#gallery" },
  { name: "Directions", link: "#directions" },
  { name: "Team", link: "#team" },
  { name: "Schedule", link: "#schedule" },
  { name: "Pricing", link: "#pricing" },
  { name: "FAQ", link: "#faq" },
  { name: "Contact", link: "#contact" },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <PageTransition>
          <div className="relative bg-background text-foreground">
            {/* Header Navigation */}
            <Header navItems={navItems} />

            {/* Sections */}
            <HeroSection />
            <GallerySection />
            <DirectionsSection />
            <TeamSection />
            <ScheduleSection />
            <PricingSection />
            <FAQSection />
            <ContactSection />
            <FooterSection />
          </div>
        </PageTransition>
      )}
    </>
  );
};

export default Index;
