"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Users,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  rating: number;
  reviewsCount?: number;
}

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
        const res = await fetch(`${serverUrl}/api/featured-studios`);
        if (res.ok) {
          const data = await res.json();
          setStudios(data);
        }
      } catch (err) {
        console.error("Failed to load featured studios:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00897b]/10 text-[#00897b] dark:text-[#80cbc4] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Handpicked Spaces</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Featured Production Studios
          </h2>

          <p className="text-[16px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            Explore top-rated creative spaces verified for professional quality, acoustic excellence, and high-end gear.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-900/40 p-4 space-y-4 animate-pulse"
              >
                <div className="h-56 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                <div className="pt-4 flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-20" />
                  <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid of Studio Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-[#00897b] dark:hover:border-[#00897b] hover:shadow-2xl hover:shadow-[#00897b]/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Studio Image Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-60" />

                    {/* Category Badge */}
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-bold text-[#00897b] dark:text-[#80cbc4] shadow-sm">
                      {studio.category}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-neutral-950/75 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1 shadow-sm">
                      {studio.rating > 0 ? (
                        <>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span>{studio.rating.toFixed(1)}</span>
                          {Boolean(studio.reviewsCount && studio.reviewsCount > 0) && (
                            <span className="text-white/60 text-[11px]">
                              ({studio.reviewsCount})
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[#80cbc4] font-semibold text-xs flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-400" />
                          New
                        </span>
                      )}
                    </div>

                    {/* Capacity Tag at Bottom of Image */}
                    <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-neutral-950/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Users className="h-3.5 w-3.5 text-[#80cbc4]" />
                      <span>Up to {studio.maxCapacity} guests</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <MapPin className="h-3.5 w-3.5 text-[#00897b] shrink-0" />
                      <span className="truncate">{studio.location}</span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#00897b] dark:group-hover:text-[#80cbc4] transition-colors line-clamp-1 leading-snug">
                      <Link href={`/studios/${studio._id}`}>
                        {studio.title}
                      </Link>
                    </h3>

                    <p className="text-[15px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {studio.overview}
                    </p>

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {studio.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2 className="h-3 w-3 text-[#00897b]" />
                          <span className="truncate max-w-[140px]">{amenity}</span>
                        </span>
                      ))}
                      {studio.amenities.length > 3 && (
                        <span className="text-xs font-semibold text-neutral-400 self-center pl-1">
                          +{studio.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="px-6 py-4 bg-neutral-50/60 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#00897b] dark:text-[#80cbc4]">
                        ${studio.hourlyRate}
                      </span>
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        / hr
                      </span>
                    </div>
                    {studio.securityDeposit > 0 && (
                      <span className="text-[11px] text-neutral-400">
                        ${studio.securityDeposit} deposit
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/studios/${studio._id}`}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-sm font-bold shadow-sm shadow-[#00897b]/20 transition-all cursor-pointer group/btn"
                  >
                    <span>View Space</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#00897b]/10 via-[#00897b]/5 to-transparent border border-[#00897b]/20 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Need a studio tailored to your exact production specs?
            </h3>
            <p className="text-[16px] text-neutral-600 dark:text-neutral-400">
              Filter through all creative spaces by space type, gear inventory, guest capacity, and hourly rate.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-[16px] font-bold shadow-lg shadow-[#00897b]/20 transition-all cursor-pointer shrink-0"
          >
            <Building2 className="h-5 w-5" />
            <span>Browse All Studios</span>
          </Link>
        </div>

      </div>
    </section>
  );
}