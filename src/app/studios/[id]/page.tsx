"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Share2,
  Info,
  Check,
  Building,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import BookingModal, { Studio } from "@/components/studios/BookingModal";
import { getServerUrl } from "@/lib/serverUrl";

export default function StudioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session } = authClient.useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [similarStudios, setSimilarStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Tomorrow as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [bookingDate, setBookingDate] = useState(defaultDateStr);
  const [bookingStartTime, setBookingStartTime] = useState("10:00");
  const [bookingEndTime, setBookingEndTime] = useState("14:00");

  useEffect(() => {
    async function loadStudio() {
      try {
        setLoading(true);
        const serverUrl = getServerUrl();
        const res = await fetch(`${serverUrl}/api/studios/${id}`);
        if (!res.ok) {
          setStudio(null);
          return;
        }
        const data: Studio = await res.json();
        setStudio(data);
        setActiveImage(data.image);

        // Fetch similar studios
        const simRes = await fetch(
          `${serverUrl}/api/studios?category=${encodeURIComponent(data.category)}`
        );
        if (simRes.ok) {
          const simData: Studio[] = await simRes.json();
          setSimilarStudios(simData.filter((s) => s._id !== data._id).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load studio details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStudio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[460px] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
                />
              ))}
            </div>
          </div>
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Building className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Studio Not Found
        </h2>
        <p className="text-neutral-500 max-w-md mb-6">
          The creative workspace you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00897b] text-white font-semibold text-sm hover:bg-[#00796b] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Studios
        </Link>
      </div>
    );
  }

  // Combined gallery
  const allImages = [studio.image, ...(studio.gallery || [])].filter(Boolean);

  // Duration & Pricing calculation
  const [sHour] = bookingStartTime.split(":").map(Number);
  const [eHour] = bookingEndTime.split(":").map(Number);
  const durationHours = Math.max(0, eHour - sHour);
  const estimatedSubtotal = durationHours * studio.hourlyRate;
  const deposit = Number(studio.securityDeposit) || 0;
  const estimatedTotal = estimatedSubtotal + deposit;

  const isOwner = session?.user?.email === studio.ownerEmail;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: studio.title,
            text: `Check out ${studio.title} on StudioSpace!`,
            url: window.location.href,
          });
          return;
        } catch {
          // User cancelled or share failed, fallback to copy
        }
      }
      navigator.clipboard.writeText(window.location.href);
      toast.success("Studio link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 pb-20 transition-colors">
      
      {/* 1. Breadcrumbs & Actions Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              href="/"
              className="hover:text-[#00897b] transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/studios"
              className="hover:text-[#00897b] transition-colors font-medium"
            >
              Studios
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#00897b] font-semibold">
              {studio.category}
            </span>
            <ChevronRight className="h-3.5 w-3.5 hidden sm:inline" />
            <span className="text-neutral-900 dark:text-white font-semibold truncate max-w-[200px] hidden sm:inline">
              {studio.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Studio</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-10">
        
        {/* 2. Title & Location Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00897b]/10 text-[#00897b] dark:bg-[#00897b]/20 dark:text-[#80cbc4]">
              {studio.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Space
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
            {studio.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-600 dark:text-neutral-400 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#00897b]" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {studio.location}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#00897b]" />
              <span>Up to {studio.maxCapacity} guests</span>
            </div>

            <div className="flex items-center gap-1.5">
              {studio.rating && studio.rating > 0 ? (
                <>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="ml-1 font-bold text-neutral-900 dark:text-white">
                      {studio.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-neutral-400">
                    ({studio.reviewsCount || 12} reviews)
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00897b] bg-[#00897b]/10 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  New Listing
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Main Split Layout: Left Content (65%) + Right Sticky Widget (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 of 12 columns) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Gallery View */}
            <div className="space-y-4">
              <div className="relative h-[340px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={activeImage || studio.image}
                  alt={studio.title}
                  fill
                  priority
                  className="object-cover object-center transition-all duration-300"
                  unoptimized
                />
              </div>

              {/* Thumbnails strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImage === img
                          ? "border-[#00897b] ring-2 ring-[#00897b]/30 scale-[1.02]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${studio.title} view ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Host Information Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#00897b] to-teal-800 text-white font-bold text-xl flex items-center justify-center shadow-md">
                  {studio.ownerName?.charAt(0).toUpperCase() || "H"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      Hosted by {studio.ownerName || "Creative Studio Host"}
                    </h3>
                    <span className="text-[11px] font-semibold bg-[#00897b]/10 text-[#00897b] px-2 py-0.5 rounded-full">
                      Verified Host
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Response time: within 1 hour • 100% response rate
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Contact:{" "}
                  <strong className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {studio.ownerEmail || "host@studiospace.com"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Space Overview */}
            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                About this creative workspace
              </h2>
              <p className="text-[16px] text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Studio Key Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider block">
                  Category
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1 block">
                  {studio.category}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider block">
                  Max Capacity
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1 block">
                  {studio.maxCapacity} Creators
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider block">
                  Security Deposit
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1 block">
                  ${studio.securityDeposit || 0} (Refundable)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider block">
                  Rating
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1 block">
                  {studio.rating && studio.rating > 0 ? `★ ${studio.rating.toFixed(1)} / 5.0` : "New Listing"}
                </span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Studio Amenities & Equipment
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {studio.amenities && studio.amenities.length > 0 ? (
                  studio.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60"
                    >
                      <div className="h-6 w-6 rounded-full bg-[#00897b]/10 dark:bg-[#00897b]/20 text-[#00897b] dark:text-[#80cbc4] flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {amenity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 col-span-3">
                    Standard studio amenities provided upon arrival.
                  </p>
                )}
              </div>
            </div>

            {/* Studio Rules & Booking Terms */}
            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                House Rules & Production Guidelines
              </h2>
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00897b] mt-0.5 shrink-0" />
                  <span>
                    <strong>Load-in & Load-out:</strong> All setup and wrap-up must be completed within your reserved booking hours.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00897b] mt-0.5 shrink-0" />
                  <span>
                    <strong>Cleanliness:</strong> Please leave the space in the exact condition you found it. Trash must be disposed of in designated bins.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00897b] mt-0.5 shrink-0" />
                  <span>
                    <strong>Noise & Sound:</strong> Maintain respectful sound levels in public corridors; live drums and high-volume amplification must be cleared in advance.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00897b] mt-0.5 shrink-0" />
                  <span>
                    <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours prior to shoot time for a 100% refund.
                  </span>
                </div>
              </div>
            </div>

            {/* Creator Reviews Section */}
            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Creator Reviews &amp; Feedback
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00897b]/10 text-[#00897b] dark:bg-[#00897b]/20 dark:text-[#80cbc4]">
                    {studio.reviews && studio.reviews.length > 0
                      ? `${studio.reviews.length} Verified`
                      : "0 Reviews"}
                  </span>
                </div>

                {studio.rating && studio.rating > 0 ? (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-900 dark:text-white">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span>{studio.rating.toFixed(1)} out of 5.0</span>
                  </div>
                ) : null}
              </div>

              {studio.reviews && studio.reviews.length > 0 ? (
                <div className="space-y-4">
                  {studio.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#00897b]/20 text-[#00897b] font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-neutral-900 dark:text-white block">
                              {rev.userName}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                rev.rating >= star
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-300 dark:text-neutral-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line pl-10">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2 text-neutral-500">
                  <p className="text-sm">
                    No creator reviews published for this space yet.
                  </p>
                  <p className="text-xs text-neutral-400">
                    Book a shoot and complete your reservation to leave the first review!
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget (4 of 12 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl p-6 sm:p-7 space-y-6">
              
              {/* Hourly Price Banner */}
              <div className="flex items-baseline justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-3xl font-black text-neutral-900 dark:text-white">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-sm font-medium ml-1.5">
                    / hour
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#00897b] dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  Instant Request
                </span>
              </div>

              {/* Owner Alert */}
              {isOwner && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>You are the host of this listing. You cannot book your own studio.</span>
                </div>
              )}

              {/* Date & Time Selectors */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#00897b]" />
                    Shoot Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#00897b]" />
                      Start
                    </label>
                    <select
                      value={bookingStartTime}
                      onChange={(e) => setBookingStartTime(e.target.value)}
                      className="w-full h-11 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] cursor-pointer"
                    >
                      {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#00897b]" />
                      End
                    </label>
                    <select
                      value={bookingEndTime}
                      onChange={(e) => setBookingEndTime(e.target.value)}
                      className="w-full h-11 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] cursor-pointer"
                    >
                      {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-2.5 text-sm">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>
                    ${studio.hourlyRate} × {durationHours} {durationHours === 1 ? "hour" : "hours"}
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    ${estimatedSubtotal}
                  </span>
                </div>

                {deposit > 0 && (
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-300 text-xs">
                    <span>Security Deposit (Refundable)</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      ${deposit}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center font-bold text-neutral-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#00897b] dark:text-[#80cbc4]">
                    ${estimatedTotal}
                  </span>
                </div>
              </div>

              {/* Primary Booking CTA */}
              <button
                type="button"
                disabled={isOwner || durationHours <= 0}
                onClick={() => {
                  if (!session?.user) {
                    toast.error("Please login first to reserve this studio");
                    router.push(`/login?redirect=/studios/${studio._id}`);
                    return;
                  }
                  setIsBookingModalOpen(true);
                }}
                className="w-full py-4 px-6 rounded-xl bg-[#00897b] hover:bg-[#00796b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer text-center block"
              >
                Book Workspace Now
              </button>

              {/* Protection Guarantee */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <ShieldCheck className="h-4 w-4 text-[#00897b] shrink-0" />
                  <span>$1,000,000 StudioSpace Host Guarantee included</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <CheckCircle2 className="h-4 w-4 text-[#00897b] shrink-0" />
                  <span>Double-booking clash protection active</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4. Similar Studios Carousel / Section */}
        {similarStudios.length > 0 && (
          <section className="pt-10 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Similar {studio.category} Spaces
                </h2>
                <p className="text-sm text-neutral-500">
                  Other top-rated studios you might like for your production
                </p>
              </div>
              <Link
                href={`/studios?category=${encodeURIComponent(studio.category)}`}
                className="text-sm font-bold text-[#00897b] hover:underline"
              >
                View all {studio.category} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarStudios.map((sim) => (
                <Link
                  key={sim._id}
                  href={`/studios/${sim._id}`}
                  className="group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <Image
                      src={sim.image}
                      alt={sim.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-neutral-900 shadow">
                      {sim.category}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-[#00897b] transition-colors truncate">
                        {sim.title}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {sim.location}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-sm font-bold text-[#00897b]">
                        ${sim.hourlyRate} / hr
                      </span>
                      <span className="text-xs text-neutral-500">
                        Up to {sim.maxCapacity} guests
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 5. Booking Modal (Handles Booking Submission + Double-booking Clash Detection) */}
      <BookingModal
        studio={studio}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedDate={bookingDate}
        preselectedStartTime={bookingStartTime}
        preselectedEndTime={bookingEndTime}
      />

    </div>
  );
}
