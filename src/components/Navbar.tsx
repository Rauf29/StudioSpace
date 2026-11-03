"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  BookmarkCheck,
  Building2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/themeToggle";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about-us" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut();
    toast.info("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        
        <Link href="/" className="flex items-center gap-2.5">
          <Aperture className="h-8 w-8 text-[#00897b] stroke-[2.3]" />
          <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            StudioSpace
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base transition-colors ${
                  isActive
                    ? "font-bold text-[#00897b]"
                    : "font-semibold text-neutral-700 hover:text-[#00897b] dark:text-neutral-200 dark:hover:text-[#00897b]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isPending ? (
            <div className="hidden sm:block h-10 w-24 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          ) : !session?.user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-10 px-5 text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:text-[#00897b] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-10 px-5 text-sm font-bold text-white bg-[#00897b] hover:bg-[#00796b] rounded-lg shadow-sm transition-all"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 rounded-full border-2 border-[#00897b] hover:ring-2 hover:ring-[#00897b]/30 transition-all outline-none cursor-pointer"
                aria-label="User menu"
              >
                <div className="relative h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 text-[#00897b] font-bold text-sm">
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{session.user.name?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 mr-1 text-neutral-600 dark:text-neutral-300 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/60 text-[#00897b] font-bold">
                      {session.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <span>{session.user.name?.charAt(0).toUpperCase() || "U"}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />

                  <div className="space-y-1">
                    <Link
                      href="/my-listings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#00897b]" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/add-studio"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <PlusCircle className="h-4 w-4 text-[#00897b]" />
                      <span>Add New Studio</span>
                    </Link>

                    <Link
                      href="/my-listings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-[#00897b]" />
                      <span>My Studio Listings</span>
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <BookmarkCheck className="h-4 w-4 text-[#00897b]" />
                      <span>My Bookings</span>
                    </Link>
                  </div>

                  <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#00897b]"
            >
              {link.name}
            </Link>
          ))}
          {!session?.user && (
            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 border rounded-lg"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-bold text-white bg-[#00897b] rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
