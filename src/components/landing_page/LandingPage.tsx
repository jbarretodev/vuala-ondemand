import HeroSection from "./HeroSection";
import WhatIsOnDemandSection from "./WhatIsOnDemandSection";
import FeaturesSection from "./FeaturesSection";
import PartnersSection from "./PartnersSection";
import DeliveryTypesSection from "./DeliveryTypesSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhatIsOnDemandSection />
      <FeaturesSection />
      <PartnersSection />
      <DeliveryTypesSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
}
