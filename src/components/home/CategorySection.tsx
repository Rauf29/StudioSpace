import Link from "next/link";
import {
  Camera,
  Mic,
  Video,
  Music,
  Users,
  Palette,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "photo-studio",
    name: "Photo Studio",
    slug: "Photo Studio",
    icon: Camera,
    tagline: "Daylight Lofts & Cyc Walls",
    description: "Cyclorama infinity walls, south-facing natural daylight lofts, and Profoto strobe kits.",
    count: "5 Studios",
  },
  {
    id: "podcast-suite",
    name: "Podcast Suite",
    slug: "Podcast Suite",
    icon: Mic,
    tagline: "Broadcast-Ready Audio",
    description: "Acoustically treated soundproof rooms, Shure SM7B mics, RØDECaster mixers, and 4K multi-cam.",
    count: "5 Studios",
  },
  {
    id: "film-stage",
    name: "Film Stage",
    slug: "Film Stage",
    icon: Video,
    tagline: "Soundstages & Green Screens",
    description: "Certified soundstages, pre-lit chromakey cyc stages, heavy power distribution, and drive-in doors.",
    count: "5 Studios",
  },
  {
    id: "music-studio",
    name: "Music Studio",
    slug: "Music Studio",
    icon: Music,
    tagline: "Analog & Dolby Atmos",
    description: "SSL 4000 consoles, floating vocal booths, vintage outboard gear, and live band tracking rooms.",
    count: "5 Studios",
  },
  {
    id: "dance-rehearsal",
    name: "Dance Rehearsal",
    slug: "Dance Rehearsal",
    icon: Users,
    tagline: "Sprung Marley & Mirrors",
    description: "Shock-absorbing sprung hardwood floors, wall-to-wall mirrors, double barres, and high-output audio.",
    count: "5 Studios",
  },
  {
    id: "creator-loft",
    name: "Creator Loft",
    slug: "Creator Loft",
    icon: Palette,
    tagline: "Lifestyle & Content Sets",
    description: "Aesthetic furnished lofts, mid-century props, natural north light, and architectural interiors.",
    count: "5 Studios",
  },
];

export function CategorySection() {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00897b]/10 text-[#00897b] dark:text-[#80cbc4] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Space Types</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Find Studios Tailored to Your Craft
            </h2>

            <p className="text-[16px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
              Explore specialized creative production spaces fully outfitted with professional grade equipment ready for your next project.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-[16px] font-bold text-[#00897b] hover:text-[#00796b] dark:text-[#80cbc4] transition-colors group self-start md:self-end"
          >
            <span>Browse All Studios</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/studios?category=${encodeURIComponent(cat.slug)}`}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7 hover:border-[#00897b] dark:hover:border-[#00897b] hover:shadow-xl hover:shadow-[#00897b]/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-[#00897b]/10 dark:bg-[#00897b]/20 text-[#00897b] dark:text-[#80cbc4] flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                      <IconComponent className="h-7 w-7 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      Explore Spaces
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#00897b] dark:group-hover:text-[#80cbc4] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#00897b] dark:text-[#80cbc4] mt-1 mb-3">
                    {cat.tagline}
                  </p>

                  <p className="text-[16px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-sm font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-[#00897b] dark:group-hover:text-[#80cbc4] transition-colors">
                  <span>Explore Listings</span>
                  <div className="h-8 w-8 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-[#00897b] group-hover:text-white transition-all">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}