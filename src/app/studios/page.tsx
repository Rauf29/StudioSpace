"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Search,
  SlidersHorizontal,
  Building2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getServerUrl } from "@/lib/serverUrl";

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

const LOCATIONS = [
  "All Locations",
  "New York",
  "Los Angeles",
  "Chicago",
  "Austin",
  "Nashville",
  "London",
];

const CATEGORIES = [
  "All Categories",
  "Photo Studio",
  "Podcast Suite",
  "Film Stage",
  "Music Studio",
  "Dance Rehearsal",
  "Creator Loft",
];

const CAPACITIES = [
  { label: "Any Capacity", value: "all" },
  { label: "1 - 5 People", value: "small" },
  { label: "6 - 15 People", value: "medium" },
  { label: "16+ People", value: "large" },
];

function StudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "All Locations";
  const initialSort = searchParams.get("sort") || "default";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCapacity, setSelectedCapacity] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const fetchStudios = useCallback(async () => {
    setLoading(true);
    try {
      const serverUrl = getServerUrl();
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== "All Categories" && selectedCategory !== "All Spaces") {
        params.append("category", selectedCategory);
      }
      if (selectedLocation && selectedLocation !== "All Locations") {
        params.append("location", selectedLocation);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (selectedSort && selectedSort !== "default") {
        params.append("sort", selectedSort);
      }

      const queryString = params.toString();
      const endpoint = `${serverUrl}/api/studios${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(endpoint);
      if (res.ok) {
        let data: Studio[] = await res.json();

        // Client-side capacity filtering
        if (selectedCapacity === "small") {
          data = data.filter((s) => s.maxCapacity <= 5);
        } else if (selectedCapacity === "medium") {
          data = data.filter((s) => s.maxCapacity > 5 && s.maxCapacity <= 15);
        } else if (selectedCapacity === "large") {
          data = data.filter((s) => s.maxCapacity > 15);
        }

        setStudios(data);
      }
    } catch (err) {
      console.error("Failed to load studios:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedLocation, selectedCapacity, searchQuery, selectedSort]);

  useEffect(() => {
    fetchStudios();

    // Sync URL parameters
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }
    if (selectedLocation && selectedLocation !== "All Locations") {
      params.set("location", selectedLocation);
    }
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedSort && selectedSort !== "default") {
      params.set("sort", selectedSort);
    }

    const url = params.toString() ? `/studios?${params.toString()}` : "/studios";
    router.replace(url, { scroll: false });
  }, [selectedCategory, selectedLocation, selectedCapacity, searchQuery, selectedSort, fetchStudios, router]);

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedCategory("All Categories");
    setSelectedCapacity("all");
    setSearchQuery("");
    setSelectedSort("default");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      
      {/* 1. CoSpace Style Hero Banner with City Skyline Background */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop"
            alt="Search Location Background"
            fill
            priority
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Search a Location
          </h1>
          <p className="text-[16px] text-neutral-300 max-w-2xl mx-auto font-normal">
            Discover and reserve verified creative production studios, daylight lofts, and soundstages by the hour.
          </p>
        </div>

        {/* 2. CoSpace Style Green Floating Filter Bar */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 lg:px-8 mt-10">
          <div
            className="rounded-xl bg-[#00897b] p-6 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-5 items-end text-white"
          >
            {/* Locations Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/90">
                Locations
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm outline-none focus:ring-2 focus:ring-white/40 cursor-pointer transition-colors [&>option]:text-neutral-900 [&>option]:bg-white"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Space Types Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/90">
                Space Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm outline-none focus:ring-2 focus:ring-white/40 cursor-pointer transition-colors [&>option]:text-neutral-900 [&>option]:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of People / Capacity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/90">
                Number of People
              </label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm outline-none focus:ring-2 focus:ring-white/40 cursor-pointer transition-colors [&>option]:text-neutral-900 [&>option]:bg-white"
              >
                {CAPACITIES.map((cap) => (
                  <option key={cap.value} value={cap.value}>
                    {cap.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Results Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        
        {/* Results Header: "Showing X locations..." on left, Search & Sort on right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Showing {studios.length} {studios.length === 1 ? "location" : "locations"}
              {selectedLocation !== "All Locations" ? ` in ${selectedLocation}` : ""}
              {selectedCategory !== "All Categories" ? ` • ${selectedCategory}` : ""}
            </h2>
          </div>

          {/* Right Controls: Search + Sort By + Reset */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Keyword Search */}
            <div className="relative min-w-[220px] sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search studio title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xs cursor-pointer p-0.5"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="h-10 px-3 pr-8 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] cursor-pointer transition-all"
              >
                <option value="default">Sort: Default / Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reset All Filters Button */}
            {(selectedLocation !== "All Locations" ||
              selectedCategory !== "All Categories" ||
              selectedCapacity !== "all" ||
              searchQuery.trim() ||
              selectedSort !== "default") && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#00897b]" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-4 animate-pulse bg-white dark:bg-neutral-900"
              >
                <div className="h-56 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5" />
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 pt-2" />
              </div>
            ))}
          </div>
        )}

        {/* 4. Cards matching CoSpace Reference Image */}
        {!loading && studios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <Link
                key={studio._id}
                href={`/studios/${studio._id}`}
                className="group block bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#00897b] dark:hover:border-[#00897b] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image matching CoSpace */}
                <div className="relative h-60 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-bold text-[#00897b] dark:text-[#80cbc4] shadow-sm">
                    {studio.category}
                  </div>
                </div>

                {/* Body Content matching CoSpace */}
                <div className="p-6 space-y-3.5">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#00897b] dark:group-hover:text-[#80cbc4] transition-colors line-clamp-1">
                    {studio.title}
                  </h3>

                  {/* Gold Star Ratings matching CoSpace: ★★★★☆ (22) or New */}
                  <div className="flex items-center gap-1.5 text-sm">
                    {studio.rating > 0 ? (
                      <>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(studio.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-300 dark:text-neutral-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">
                          ({studio.reviewsCount || 22})
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-[#00897b] dark:text-[#80cbc4] flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        New Listing
                      </span>
                    )}
                  </div>

                  {/* Bulleted Amenities List matching CoSpace */}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                    {studio.amenities.slice(0, 5).join(" • ")}
                  </p>

                  {/* Price Section matching CoSpace:
                      Start from
                      $85 / Hour
                  */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="block text-xs text-neutral-400 font-medium">
                      Start from
                    </span>
                    <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
                      ${studio.hourlyRate} <span className="text-sm font-normal text-neutral-500">/ Hour</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && studios.length === 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <Building2 className="h-12 w-12 text-[#00897b] mx-auto" />
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              No Locations Found
            </h3>
            <p className="text-[16px] text-neutral-600 dark:text-neutral-400">
              There are no studios matching your filter selections. Try changing your location or space type.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-lg bg-[#00897b] hover:bg-[#00796b] text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#00897b] border-t-transparent" />
        </div>
      }
    >
      <StudiosContent />
    </Suspense>
  );
}