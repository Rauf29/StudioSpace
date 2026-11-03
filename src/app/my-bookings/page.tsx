"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Building,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Star,
  X,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { getServerUrl } from "@/lib/serverUrl";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage?: string;
  hostEmail: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  hasReviewed?: boolean;
  createdAt: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchMyBookings = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const res = await fetch(`${serverUrl}/api/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        toast.error("Failed to load your reservations");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error loading reservations");
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session?.user) {
        router.push("/login?redirect=/my-bookings");
      } else {
        fetchMyBookings();
      }
    }
  }, [session, sessionLoading, router, fetchMyBookings]);

  // Handle Cancel Booking
  const handleCancelBooking = async () => {
    if (!cancelTarget) return;

    setCancelLoading(true);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const res = await fetch(
        `${serverUrl}/api/bookings/${cancelTarget._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success("Booking reservation cancelled successfully.");
        setCancelTarget(null);
        // Update local state to cancelled
        setBookings((prev) =>
          prev.map((b) =>
            b._id === cancelTarget._id ? { ...b, status: "Cancelled" } : b
          )
        );
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to cancel booking");
      }
    } catch {
      toast.error("Network error while cancelling");
    } finally {
      setCancelLoading(false);
    }
  };

  // Submit Studio Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;

    if (!reviewComment.trim()) {
      toast.error("Please enter a short review feedback.");
      return;
    }

    setReviewLoading(true);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const res = await fetch(
        `${serverUrl}/api/studios/${reviewTarget.studioId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewComment.trim(),
            bookingId: reviewTarget._id,
          }),
        }
      );

      if (res.ok) {
        toast.success("Thank you! Your review has been submitted.");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === reviewTarget._id ? { ...b, hasReviewed: true } : b
          )
        );
        setReviewTarget(null);
        setReviewComment("");
        setReviewRating(5);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to submit review");
      }
    } catch {
      toast.error("Network error while submitting review");
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Host Approval</span>
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Completed</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            <XCircle className="h-3.5 w-3.5 text-neutral-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-6">
        <div className="h-8 w-60 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-36 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 pb-20 transition-colors">
      
      {/* Header Banner */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00897b]">
              <span>Creator Account</span>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
              My Bookings & Reservations
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Review your reserved studio shoot hours, confirmed slots, and booking status.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Explore More Studios</span>
            <ArrowRight className="h-4 w-4 text-[#00897b]" />
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        
        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-lg mx-auto space-y-5 my-12 shadow-sm">
            <div className="h-16 w-16 mx-auto rounded-full bg-teal-50 dark:bg-teal-950/50 text-[#00897b] flex items-center justify-center">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                No Bookings Found
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                You haven&apos;t booked any studio spaces yet. Discover daylight lofts, podcast suites, and cinema soundstages.
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm transition-all shadow cursor-pointer"
            >
              <span>Browse Creative Spaces</span>
            </Link>
          </div>
        ) : (
          /* Bookings List Cards */
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Studio Thumbnail & Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {booking.studioImage ? (
                    <div className="relative h-20 w-24 sm:h-24 sm:w-32 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                      <Image
                        src={booking.studioImage}
                        alt={booking.studioTitle}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-24 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <Building className="h-8 w-8" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <span className="text-xs text-neutral-400">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="text-lg font-bold text-neutral-900 dark:text-white hover:text-[#00897b] transition-colors block truncate"
                    >
                      {booking.studioTitle}
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Mail className="h-3.5 w-3.5 text-[#00897b]" />
                      <span>Host: {booking.hostEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Date, Time & Cost Details */}
                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
                  <div className="space-y-1 text-left sm:text-right">
                    <div className="flex items-center lg:justify-end gap-1.5 text-sm font-bold text-neutral-900 dark:text-white">
                      <Calendar className="h-4 w-4 text-[#00897b]" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center lg:justify-end gap-1.5 text-xs text-neutral-500 font-medium">
                      <Clock className="h-3.5 w-3.5 text-[#00897b]" />
                      <span>
                        {booking.startTime} - {booking.endTime} ({booking.hours} {booking.hours === 1 ? "hr" : "hrs"})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block">Total Cost</span>
                    <span className="text-xl font-black text-[#00897b] dark:text-[#80cbc4]">
                      ${booking.totalPrice}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {booking.status === "Pending" && (
                      <button
                        onClick={() => setCancelTarget(booking)}
                        className="py-2 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer w-full sm:w-auto text-center"
                      >
                        Cancel Reservation
                      </button>
                    )}

                    {/* Completed Shoot -> Leave Review */}
                    {booking.status === "Completed" && (
                      booking.hasReviewed ? (
                        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                          <span>Reviewed</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setReviewTarget(booking);
                            setReviewRating(5);
                            setReviewComment("");
                          }}
                          className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold transition-all shadow cursor-pointer w-full sm:w-auto text-center justify-center"
                        >
                          <Star className="h-3.5 w-3.5 fill-white text-white" />
                          <span>Leave Review</span>
                        </button>
                      )
                    )}

                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="py-2 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer w-full sm:w-auto text-center"
                    >
                      View Space
                    </Link>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Cancel Reservation Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5 text-center">
            <div className="h-14 w-14 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Cancel Studio Reservation?
              </h3>
              <p className="text-sm text-neutral-500">
                Are you sure you want to cancel your shoot for <strong className="text-neutral-800 dark:text-neutral-200">{cancelTarget.studioTitle}</strong> on {cancelTarget.date}?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {cancelLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Studio Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Review &amp; Rate Studio
                </h3>
              </div>
              <button
                onClick={() => setReviewTarget(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-lg text-neutral-900 dark:text-white">
                  How was your shoot at {reviewTarget.studioTitle}?
                </h4>
                <p className="text-xs text-neutral-500">
                  Your feedback helps other filmmakers, photographers, and musicians.
                </p>
              </div>

              {/* Star Rating Picker */}
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          (reviewHoverRating || reviewRating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300 dark:text-neutral-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {reviewRating === 5 && "5 Stars - Phenomenal Studio!"}
                  {reviewRating === 4 && "4 Stars - Great Experience!"}
                  {reviewRating === 3 && "3 Stars - Average Workspace"}
                  {reviewRating === 2 && "2 Stars - Room for Improvement"}
                  {reviewRating === 1 && "1 Star - Unsatisfactory"}
                </span>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Your Feedback &amp; Review
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about acoustics, lighting, cleanliness, host hospitality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm shadow cursor-pointer disabled:opacity-50"
                >
                  {reviewLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
