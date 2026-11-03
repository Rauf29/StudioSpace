import { HeroSlider } from "@/components/home/HeroSlider";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedStudios } from "@/components/home/FeaturedStudios";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <HeroSlider />
      <CategorySection />
      <FeaturedStudios />
    </main>
  );
}