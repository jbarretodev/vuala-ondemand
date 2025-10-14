import HeroSection from "./HeroSection";
import WhatIsOnDemandSection from "./WhatIsOnDemandSection";
import FeaturesSection from "./FeaturesSection";
import PartnersSection from "./PartnersSection";
import DeliveryTypesSection from "./DeliveryTypesSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Nabvar from "./Navbar";
import StatsStrip from "./StatsStrip";
import AboutSection from "./AboutSection";
import SmartSolutions from "./SmartSolutions";
import IntegrationsGrid from "./IntegrationsGrid";


export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nabvar/>
      <HeroSection />
      <StatsStrip/>
      <AboutSection/>
      <SmartSolutions/>
      <IntegrationsGrid/>
      <FeaturesSection />
      <PartnersSection />
      <DeliveryTypesSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
}
