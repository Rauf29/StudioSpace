"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Aperture, Lock, Mail } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid email or password");
      } else {
        toast.success("Welcome back to StudioSpace!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    toast.info("Google Authentication is connecting...");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Aperture className="h-8 w-8 text-[#00897b] stroke-[2.3]" />
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              StudioSpace
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white pt-2">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Log in to manage your studios and bookings
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                className="w-full h-11 pl-11 pr-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info("Password reset link will be sent to your email.")}
                className="text-xs font-semibold text-[#00897b] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-11 pr-4 text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:border-[#00897b] text-neutral-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 text-base font-bold text-white bg-[#00897b] hover:bg-[#00796b] rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
          <span className="bg-white dark:bg-neutral-900 px-3 text-xs text-neutral-500 uppercase tracking-wider whitespace-nowrap">
            or continue with
          </span>
          <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-11 flex items-center justify-center gap-3 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-[#00897b] hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
