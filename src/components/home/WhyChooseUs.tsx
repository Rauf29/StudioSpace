import {
  ShieldCheck,
  Clock,
  Lock,
  Zap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Gear & Acoustics",
    description:
      "Every cyclorama wall, vocal isolation booth, and strobe package is inspected and verified to meet professional production standards before listing.",
  },
  {
    icon: Clock,
    title: "Flexible Hourly Bookings",
    description:
      "Book the exact hours you need without paying for 12-hour minimums or enduring back-and-forth email scheduling chains.",
  },
  {
    icon: Lock,
    title: "Comprehensive Space Insurance",
    description:
      "Every production session is backed by liability coverage and equipment damage protection, giving creators and hosts complete peace of mind.",
  },
  {
    icon: Zap,
    title: "Direct Peer Collaboration",
    description:
      "Connect directly with studio owners, fellow photographers, and sound engineers to arrange custom lighting setups and gear packages.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="how-it-works" className="py-24 bg-neutral-50 dark:bg-neutral-900/40 border-y border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00897b]/10 text-[#00897b] dark:text-[#80cbc4] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built for Creators</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Why 48,000+ Creators Choose StudioSpace
          </h2>

          <p className="text-[16px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            We eliminate the friction of creative production rentals. Rent verified studios with professional audio-visual gear, zero hidden fees, and transparent hourly pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 hover:border-[#00897b] dark:hover:border-[#00897b] hover:shadow-xl hover:shadow-[#00897b]/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#00897b]/10 dark:bg-[#00897b]/20 text-[#00897b] dark:text-[#80cbc4] flex items-center justify-center">
                    <Icon className="h-7 w-7 stroke-[2.2]" />
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {feat.title}
                  </h3>

                  <p className="text-[16px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-xs font-bold text-[#00897b] dark:text-[#80cbc4] uppercase tracking-wider">
                    Standard Guarantee
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-[16px] font-bold text-[#00897b] hover:text-[#00796b] dark:text-[#80cbc4] transition-colors group"
          >
            <span>Start exploring verified studios today</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}