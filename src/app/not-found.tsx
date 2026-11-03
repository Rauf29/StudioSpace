import Link from "next/link";
import { Aperture, ArrowLeft, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-neutral-50/50 dark:bg-neutral-950/50 transition-colors">
      <div className="max-w-lg w-full text-center space-y-8">
        
        {/* Creative Aperture / Spotlight Illustration */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#00897b]/10 dark:bg-[#00897b]/20 animate-ping opacity-30" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#00897b]/20 to-teal-500/10 dark:from-[#00897b]/40 dark:to-teal-500/20 border border-[#00897b]/30 flex items-center justify-center shadow-inner">
            <Aperture className="w-14 h-14 text-[#00897b] stroke-[1.8] animate-spin-slow" />
          </div>
          <span className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#00897b] text-white shadow">
            404
          </span>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Studio Set Not Found
          </h1>
          <p className="text-[16px] text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            The creative production stage or workspace you are looking for has either wrapped production, changed locations, or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#00897b]" />
            <span>Explore Studios</span>
          </Link>
        </div>

        {/* Help Tip */}
        <p className="text-xs text-neutral-400 dark:text-neutral-500 pt-4">
          Need help? Contact support at <span className="text-[#00897b]">support@studiospace.com</span>
        </p>

      </div>
    </div>
  );
}
