import { HeroSlider } from "@/components/home/HeroSlider";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedStudios } from "@/components/home/FeaturedStudios";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HostGuarantee } from "@/components/home/HostGuarantee";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <HeroSlider />
      <CategorySection />
      <FeaturedStudios />
      <WhyChooseUs />
      <HostGuarantee />
    </main>
  );
}