import { HeroSection } from "@/components/hero-section";
import { FeaturedListings } from "@/components/featured-listings";
import { HowItWorks } from "@/components/how-it-works";
import { TrustSafety } from "@/components/trust-safety";
import { DownloadApp } from "@/components/download-app";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedListings />
      <HowItWorks />
      <TrustSafety />
      <DownloadApp />
    </main>
  );
}
