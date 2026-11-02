"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, Menu, X, PlusCircle, LayoutDashboard, BookmarkCheck, Building2, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/themeToggle";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about-us" },
  ];

  const handleLogout = async () => {
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

          {!session?.user ? (
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
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-10 w-10 border-2 border-[#00897b] cursor-pointer">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                  <AvatarFallback className="bg-emerald-100 text-[#00897b] font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground leading-none">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="p-0">
                  <Link href="/my-listings" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 text-[#00897b]" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0">
                  <Link href="/add-studio" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <PlusCircle className="h-4 w-4 text-[#00897b]" />
                    <span>Add New Studio</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0">
                  <Link href="/my-listings" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <Building2 className="h-4 w-4 text-[#00897b]" />
                    <span>My Studio Listings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0">
                  <Link href="/my-bookings" className="flex items-center gap-2 w-full px-2 py-1.5 cursor-pointer">
                    <BookmarkCheck className="h-4 w-4 text-[#00897b]" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
