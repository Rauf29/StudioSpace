"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  ExternalLink,
  AlertTriangle,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Calendar,
  Users,
  Mail,
  User,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
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
  overview: string;
  rating: number;
  createdAt: string;
}

interface HostBooking {
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
  createdAt: string;
}

const CATEGORIES = [
  "Photo Studio",
  "Podcast Suite",
  "Film Stage",
  "Music Studio",
  "Dance Rehearsal",
  "Creator Loft",
];

function MyListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "reservations" ? "reservations" : "studios";

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [activeTab, setActiveTab] = useState<"studios" | "reservations">(initialTab);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [hostBookings, setHostBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoadingId, setStatusUpdateLoadingId] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit modal state
  const [editTarget, setEditTarget] = useState<Studio | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    hourlyRate: 0,
    securityDeposit: 0,
    maxCapacity: 1,
    location: "",
    image: "",
    overview: "",
  });

  const fetchMyData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch both my studios and host bookings simultaneously
      const [studiosRes, bookingsRes] = await Promise.all([
        fetch(`${serverUrl}/api/my-studios`, { headers }),
        fetch(`${serverUrl}/api/host-bookings`, { headers }),
      ]);

      if (studiosRes.ok) {
        const studiosData = await studiosRes.json();
        setStudios(studiosData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setHostBookings(bookingsData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error loading your host dashboard data");
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session?.user) {
        router.push("/login?redirect=/my-listings");
      } else {
        fetchMyData();
      }
    }
  }, [session, sessionLoading, router, fetchMyData]);

  // Open Edit Modal with pre-filled values
  const handleOpenEdit = (studio: Studio) => {
    setEditTarget(studio);
    setEditForm({
      title: studio.title,
      category: studio.category,
      hourlyRate: studio.hourlyRate,
      securityDeposit: studio.securityDeposit || 0,
      maxCapacity: studio.maxCapacity || 1,
      location: studio.location,
      image: studio.image,
      overview: studio.overview,
    });
  };

  // Submit Studio Update
  const handleUpdateStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    setEditLoading(true);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const res = await fetch(`${serverUrl}/api/studios/${editTarget._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success("Studio listing updated successfully!");
        setEditTarget(null);
        fetchMyData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update studio");
      }
    } catch {
      toast.error("Network error while updating");
    } finally {
      setEditLoading(false);
    }
  };

  // Confirm Studio Delete
  const handleDeleteStudio = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const res = await fetch(`${serverUrl}/api/studios/${deleteTarget._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Studio deleted successfully!");
        setDeleteTarget(null);
        setStudios((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to delete studio");
      }
    } catch {
      toast.error("Network error while deleting");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Host Booking Action (Confirm / Decline / Complete)
  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: "Confirmed" | "Completed" | "Cancelled"
  ) => {
    setStatusUpdateLoadingId(bookingId);
    try {
      const serverUrl = getServerUrl();
      const token = await getTokenFromClient();

      const res = await fetch(`${serverUrl}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Booking ${newStatus === "Cancelled" ? "declined" : newStatus.toLowerCase()} successfully!`);
        setHostBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update booking status");
      }
    } catch {
      toast.error("Network error updating status");
    } finally {
      setStatusUpdateLoadingId(null);
    }
  };

  const pendingBookingsCount = hostBookings.filter(
    (b) => b.status === "Pending"
  ).length;

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-6">
        <div className="h-8 w-60 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse"
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
              <span>Host Management Center</span>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
              Host Studio Dashboard
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Manage your published creative workspaces and respond to incoming guest reservation requests.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>List New Studio</span>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-8 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab("studios")}
            className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "studios"
                ? "border-[#00897b] text-[#00897b]"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>My Published Studios</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {studios.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reservations")}
            className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "reservations"
                ? "border-[#00897b] text-[#00897b]"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Bookings Received</span>
            {pendingBookingsCount > 0 ? (
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                {pendingBookingsCount} Action Needed
              </span>
            ) : (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {hostBookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        
        {/* ======================================================== */}
        {/* TAB 1: MY STUDIOS LISTINGS */}
        {/* ======================================================== */}
        {activeTab === "studios" && (
          <div>
            {studios.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-lg mx-auto space-y-5 my-12 shadow-sm">
                <div className="h-16 w-16 mx-auto rounded-full bg-teal-50 dark:bg-teal-950/50 text-[#00897b] flex items-center justify-center">
                  <Building2 className="h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    No Studios Published Yet
                  </h3>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    You haven&apos;t published any creative workspaces. Start hosting your photo loft, film stage, or music studio today.
                  </p>
                </div>
                <Link
                  href="/add-studio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm transition-all shadow cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>List Your First Studio</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studios.map((studio) => (
                  <div
                    key={studio._id}
                    className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Studio Cover Image */}
                      <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800">
                        <Image
                          src={studio.image}
                          alt={studio.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-neutral-900 shadow">
                          {studio.category}
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00897b] text-white shadow">
                          ${studio.hourlyRate}/hr
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white line-clamp-1">
                          {studio.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <MapPin className="h-3.5 w-3.5 text-[#00897b] shrink-0" />
                          <span className="truncate">{studio.location}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-[#00897b]" />
                            Up to {studio.maxCapacity} creators
                          </span>
                          <span>
                            Deposit: <strong>${studio.securityDeposit || 0}</strong>
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 pt-1">
                          {studio.overview}
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 bg-neutral-50/60 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <Link
                        href={`/studios/${studio._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#00897b] transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View Live</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(studio)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeleteTarget(studio)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: GUEST BOOKINGS RECEIVED (HOST RESERVATIONS) */}
        {/* ======================================================== */}
        {activeTab === "reservations" && (
          <div>
            {hostBookings.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-lg mx-auto space-y-4 my-12 shadow-sm">
                <div className="h-16 w-16 mx-auto rounded-full bg-teal-50 dark:bg-teal-950/50 text-[#00897b] flex items-center justify-center">
                  <CalendarCheck className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    No Guest Bookings Yet
                  </h3>
                  <p className="text-sm text-neutral-500">
                    When creators reserve hours at your studio listings, their reservation requests will appear here for your confirmation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {hostBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Guest & Studio Details */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      {booking.studioImage ? (
                        <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
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
                          <Building2 className="h-8 w-8" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {booking.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Pending Confirmation</span>
                            </span>
                          )}
                          {booking.status === "Confirmed" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Confirmed Reservation</span>
                            </span>
                          )}
                          {booking.status === "Completed" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                              <span>Shoot Completed</span>
                            </span>
                          )}
                          {booking.status === "Cancelled" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                              <XCircle className="h-3.5 w-3.5 text-neutral-500" />
                              <span>Cancelled / Declined</span>
                            </span>
                          )}

                          <span className="text-xs text-neutral-400">
                            Requested {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                          {booking.studioTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300 pt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-[#00897b]" />
                            Guest: <strong>{booking.userName}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-[#00897b]" />
                            {booking.userEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Time & Actions */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
                      <div className="space-y-1 text-left sm:text-right">
                        <div className="flex items-center lg:justify-end gap-1.5 text-sm font-bold text-neutral-900 dark:text-white">
                          <Calendar className="h-4 w-4 text-[#00897b]" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center lg:justify-end gap-1.5 text-xs text-neutral-500 font-medium">
                          <Clock className="h-3.5 w-3.5 text-[#00897b]" />
                          <span>
                            {booking.startTime} - {booking.endTime} ({booking.hours} hrs)
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 block">Host Payout</span>
                        <span className="text-xl font-black text-[#00897b] dark:text-[#80cbc4]">
                          ${booking.totalPrice}
                        </span>
                      </div>

                      {/* Action Buttons for Host */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {booking.status === "Pending" && (
                          <>
                            <button
                              disabled={statusUpdateLoadingId === booking._id}
                              onClick={() =>
                                handleUpdateBookingStatus(booking._id, "Confirmed")
                              }
                              className="py-2.5 px-4 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {statusUpdateLoadingId === booking._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              <span>Confirm Booking</span>
                            </button>

                            <button
                              disabled={statusUpdateLoadingId === booking._id}
                              onClick={() =>
                                handleUpdateBookingStatus(booking._id, "Cancelled")
                              }
                              className="py-2.5 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {booking.status === "Confirmed" && (
                          <button
                            disabled={statusUpdateLoadingId === booking._id}
                            onClick={() =>
                              handleUpdateBookingStatus(booking._id, "Completed")
                            }
                            className="py-2 px-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 1. Edit Studio Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Update Studio Listing
              </h3>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudio} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Studio Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b] cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Location / City
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.hourlyRate}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Security Deposit ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.securityDeposit}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        securityDeposit: Number(e.target.value),
                      })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.maxCapacity}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        maxCapacity: Number(e.target.value),
                      })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                  className="w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Overview Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editForm.overview}
                  onChange={(e) =>
                    setEditForm({ ...editForm, overview: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00897b]/40 focus:border-[#00897b]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm shadow cursor-pointer disabled:opacity-50"
                >
                  {editLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5 text-center">
            <div className="h-14 w-14 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Delete Studio Listing?
              </h3>
              <p className="text-sm text-neutral-500">
                Are you sure you want to delete <strong className="text-neutral-800 dark:text-neutral-200">{deleteTarget.title}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteStudio}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function MyListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00897b]" />
        </div>
      }
    >
      <MyListingsContent />
    </Suspense>
  );
}
