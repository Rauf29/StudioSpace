"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "react-toastify";
import {
  Building2,
  DollarSign,
  MapPin,
  Users,
  Image as ImageIcon,
  Sparkles,
  ShieldAlert,
  Layers,
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Photo Studio",
  "Podcast Suite",
  "Film Stage",
  "Music Studio",
  "Dance Rehearsal",
  "Creator Loft",
];

const AVAILABLE_AMENITIES = [
  "High-Speed Wi-Fi",
  "Cyclorama Infinity Wall",
  "Soundproofing & Acoustic Foam",
  "Continuous LED & Strobe Lighting",
  "Shure SM7B Microphones",
  "Hair & Makeup Vanity Station",
  "Private Dressing Room",
  "Air Conditioning & Heating",
  "Free On-Site Parking",
  "Lounge & Kitchenette",
  "Freight Elevator Access",
  "4K Production Cameras",
];

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [hourlyRate, setHourlyRate] = useState<number | "">("");
  const [securityDeposit, setSecurityDeposit] = useState<number | "">("");
  const [maxCapacity, setMaxCapacity] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [overview, setOverview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.info("Please log in to list your studio.");
      router.push("/login");
    }
  }, [session, isPending, router]);

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const addGalleryImage = () => {
    if (!galleryInput.trim()) return;
    if (gallery.includes(galleryInput.trim())) {
      toast.warning("Image URL is already added.");
      return;
    }
    setGallery((prev) => [...prev, galleryInput.trim()]);
    setGalleryInput("");
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !hourlyRate || !location || !image || !overview) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (Number(hourlyRate) <= 0) {
      toast.error("Hourly rate must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
      const payload = {
        title: title.trim(),
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit) || 0,
        maxCapacity: Number(maxCapacity) || 1,
        location: location.trim(),
        image: image.trim(),
        gallery,
        amenities,
        overview: overview.trim(),
      };

      const token = await getTokenFromClient();

      const res = await fetch(`${serverUrl}/api/studios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create studio");
      }

      toast.success("Studio published successfully!");
      router.push("/studios");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish studio";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#00897b] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#00897b] transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              List Your Creative Studio
            </h1>
            <p className="text-[16px] text-neutral-600 dark:text-neutral-400 mt-1">
              Share your production space with photographers, filmmakers, and musicians worldwide.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <Building2 className="h-5 w-5 text-[#00897b]" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Basic Studio Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Studio Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dumbo Natural Light Daylight Loft & Cyclorama"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Location (City, Neighborhood) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brooklyn, New York"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <DollarSign className="h-5 w-5 text-[#00897b]" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Pricing & Capacity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Hourly Rate ($ USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="85"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full h-11 pl-9 pr-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Security Deposit ($ USD)
                </label>
                <div className="relative">
                  <ShieldAlert className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
                  <input
                    type="number"
                    min="0"
                    placeholder="100"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full h-11 pl-11 pr-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Max Guest Capacity
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
                  <input
                    type="number"
                    min="1"
                    placeholder="15"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full h-11 pl-11 pr-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <ImageIcon className="h-5 w-5 text-[#00897b]" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Photos & Media
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Primary Cover Photo URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-11 px-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                />
              </div>

              {image && (
                <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <Image
                    src={image}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="space-y-2 pt-2">
                <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Additional Gallery Images (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    className="flex-1 h-11 px-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="h-11 px-5 rounded-lg bg-[#00897b] hover:bg-[#00796b] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                    {gallery.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative h-28 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800"
                      >
                        <Image
                          src={url}
                          alt={`Gallery image ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <Sparkles className="h-5 w-5 text-[#00897b]" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Studio Amenities
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#00897b]/10 border-[#00897b] text-[#00897b] dark:text-[#80cbc4]"
                        : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-[#00897b] border-[#00897b] text-white"
                          : "border-neutral-400"
                      }`}
                    >
                      {isSelected && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <FileText className="h-5 w-5 text-[#00897b]" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Detailed Overview
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Studio Description & Rules <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe the studio dimensions, natural light direction, included audio/visual gear, access instructions, and space rules..."
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full p-4 text-[16px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 flex items-center gap-3">
            <Layers className="h-5 w-5 text-[#00897b] shrink-0" />
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Listing as <span className="font-bold text-neutral-900 dark:text-white">{session.user.name}</span> ({session.user.email}). All booking requests and payouts will be sent to your account.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-[16px] font-bold shadow-lg shadow-[#00897b]/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Publishing Studio..." : "Publish Studio Listing"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}