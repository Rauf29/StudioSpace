"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Camera, Mic, Music, ArrowRight } from "lucide-react";

interface Slide {
  id: number;
  tag: string;
  icon: typeof Camera;
  title: string;
  highlight: string;
  description: string;
  location: string;
  image: string;
  price: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "Photography & Film Stage",
    icon: Camera,
    title: "Capture Masterpieces in",
    highlight: "World-Class Photo Studios",
    description: "Rent fully equipped cyclorama stages, high-end Profoto lighting kits, and natural light daylight lofts by the hour from fellow creators.",
    location: "Brooklyn, New York",
    price: "$85/hr",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    tag: "Podcast & Broadcast Suite",
    icon: Mic,
    title: "Record Crisp Audio in",
    highlight: "Soundproof Podcast Suites",
    description: "Broadcast-ready podcast rooms with Shure SM7B microphones, 4K multi-cam setups, and acoustic soundproofing for seamless production.",
    location: "Downtown, Los Angeles",
    price: "$60/hr",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    tag: "Music Recording & Mixing Stage",
    icon: Music,
    title: "Produce Your Sound in",
    highlight: "Pro Audio Live Rooms",
    description: "From vintage analog consoles and Genelec monitors to isolated vocal booths and live drum rooms. Perfect for bands and music producers.",
    location: "East Nashville, Tennessee",
    price: "$110/hr",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative overflow-hidden bg-neutral-900 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const TagIcon = slide.icon;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/80 to-neutral-950/30" />
                <div className="absolute inset-0 bg-neutral-950/30" />
              </div>

              <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col justify-center h-full">
                <div className="max-w-2xl space-y-6">
                  
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00897b]/20 border border-[#00897b]/40 backdrop-blur-sm text-sm font-semibold text-[#80cbc4]">
                    <TagIcon className="h-4 w-4 text-[#26a69a]" />
                    <span>{slide.tag}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-bold">{slide.price}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                    {slide.title}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#26a69a] to-[#80cbc4]">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="text-[16px] text-neutral-300 leading-relaxed font-normal">
                    {slide.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/studios"
                      className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-[16px] font-bold shadow-lg shadow-[#00897b]/30 transition-all cursor-pointer"
                    >
                      <span>Explore Studios</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>

                    <Link
                      href="/add-studio"
                      className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[16px] font-bold backdrop-blur-sm transition-all cursor-pointer"
                    >
                      Host Your Space
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-xs text-neutral-400 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#26a69a]" />
                    <span>Featured Studio in {slide.location}</span>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 lg:left-8 z-30 p-3 rounded-full bg-neutral-900/60 hover:bg-[#00897b] border border-white/10 text-white backdrop-blur-sm transition-all cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 lg:right-8 z-30 p-3 rounded-full bg-neutral-900/60 hover:bg-[#00897b] border border-white/10 text-white backdrop-blur-sm transition-all cursor-pointer"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-8 bg-[#26a69a]"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-20 border-t border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#26a69a]">150+</div>
            <div className="text-[14px] text-neutral-400 font-medium mt-0.5">Verified Studios</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white">48,000+</div>
            <div className="text-[14px] text-neutral-400 font-medium mt-0.5">Creative Hours Booked</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white">15+</div>
            <div className="text-[14px] text-neutral-400 font-medium mt-0.5">Metropolitan Cities</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-[#80cbc4] flex items-center justify-center gap-1">
              <span>4.9</span>
              <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-[14px] text-neutral-400 font-medium mt-0.5">Average Host Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}