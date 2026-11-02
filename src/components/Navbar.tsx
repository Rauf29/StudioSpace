"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture } from "lucide-react";
import { ThemeToggle } from "@/components/themeToggle";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about-us" },
  ];

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
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-10 px-6 text-sm font-bold text-white bg-[#00897b] hover:bg-[#00796b] rounded-lg shadow-sm transition-all"
              >
                Log In
              </Link>
            </div>
          ) : (
            <div className="text-base font-bold text-[#00897b]">
              {session.user.name}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
