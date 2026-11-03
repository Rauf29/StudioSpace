"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  CreditCard,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities?: string[];
  overview?: string;
  rating?: number;
  reviewsCount?: number;
  ownerEmail?: string;
  ownerName?: string;
  reviews?: Array<{
    userEmail: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
  preselectedDate?: string;
  preselectedStartTime?: string;
  preselectedEndTime?: string;
}

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export default function BookingModal({
  studio,
  isOpen,
  onClose,
  preselectedDate,
  preselectedStartTime,
  preselectedEndTime,
}: BookingModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Get tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(preselectedDate || defaultDateStr);
  const [startTime, setStartTime] = useState(preselectedStartTime || "10:00");
  const [endTime, setEndTime] = useState(preselectedEndTime || "14:00");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate duration
  const [startHour] = startTime.split(":").map(Number);
  const [endHour] = endTime.split(":").map(Number);
  const totalHours = Math.max(0, endHour - startHour);
  const subtotal = totalHours * studio.hourlyRate;
  const deposit = Number(studio.securityDeposit) || 0;
  const grandTotal = subtotal + deposit;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!session?.user) {
      toast.error("Please login first to reserve this studio");
      router.push(`/login?redirect=/studios/${studio._id}`);
      return;
    }

    if (session.user.email === studio.ownerEmail) {
      setErrorMessage("You cannot book your own studio listing.");
      toast.error("Host restriction: You cannot book your own studio.");
      return;
    }

    if (startHour >= endHour) {
      setErrorMessage("End time must be at least 1 hour after start time.");
      return;
    }

    setLoading(true);

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
      const token = await getTokenFromClient();

      const res = await fetch(`${serverUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage(
            data.message ||
              "This time slot is already confirmed for another booking. Please select different hours."
          );
          toast.error("Double-booking clash detected for this slot!");
        } else {
          setErrorMessage(data.message || "Failed to submit booking reservation.");
          toast.error(data.message || "Booking failed");
        }
        return;
      }

      toast.success("Booking reservation requested successfully!");
      setSuccessBookingId(data.insertedId);
    } catch (err) {
      console.error(err);
      setErrorMessage("A network error occurred. Please try again.");
      toast.error("Could not complete reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00897b]" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {successBookingId ? "Reservation Confirmed" : "Request Studio Reservation"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success View */}
        {successBookingId ? (
          <div className="p-8 text-center space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#00897b] dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-950/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Booking Request Sent!
              </h4>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-md mx-auto">
                Your reservation for <strong className="text-neutral-900 dark:text-white">{studio.title}</strong> has been submitted. The host has been notified.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Date:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Hours:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {startTime} - {endTime} ({totalHours} hrs)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Total Amount:</span>
                <span className="font-bold text-[#00897b] dark:text-[#80cbc4]">
                  ${grandTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Pending Host Approval
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  router.push("/my-bookings");
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                View My Bookings
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
            
            {/* Studio Summary Pill */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60">
              <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={studio.image}
                  alt={studio.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#00897b] dark:text-[#80cbc4]">
                  {studio.category}
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                  {studio.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{studio.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-neutral-900 dark:text-white">
                  ${studio.hourlyRate}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  per hour
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Shoot Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#00897b]" />
                Shoot / Booking Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
              />
            </div>

            {/* Time Slot Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#00897b]" />
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] cursor-pointer"
                >
                  {TIME_SLOTS.slice(0, -1).map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#00897b]" />
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] cursor-pointer"
                >
                  {TIME_SLOTS.filter((s) => s > startTime).map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Calculation Breakdown */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-2.5 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                <span>
                  ${studio.hourlyRate} × {totalHours} {totalHours === 1 ? "hour" : "hours"}
                </span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  ${subtotal}
                </span>
              </div>

              {deposit > 0 && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span className="flex items-center gap-1">
                    Refundable Security Deposit
                    <span className="text-[10px] text-neutral-400">(Returned after shoot)</span>
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    ${deposit}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center text-base font-bold text-neutral-900 dark:text-white">
                <span>Estimated Total</span>
                <span className="text-lg text-[#00897b] dark:text-[#80cbc4]">
                  ${grandTotal}
                </span>
              </div>
            </div>

            {/* Host Guarantee Footer Notice */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="h-4 w-4 text-[#00897b] shrink-0" />
              <span>
                Protected by StudioSpace Creator Guarantee. Free cancellation up to 24 hours before shoot.
              </span>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || totalHours <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00897b] hover:bg-[#00796b] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking Slot...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Confirm Request (${grandTotal})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
