import { HeroSlider } from "@/components/home/HeroSlider";
import { CategorySection } from "@/components/home/CategorySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <HeroSlider />
      <CategorySection />
    </main>
  );
}