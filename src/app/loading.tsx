import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#00897b]/20 border-t-[#00897b] animate-spin" />
        <Aperture className="absolute h-7 w-7 text-[#00897b]" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-wide">
          StudioSpace
        </p>
        <p className="text-xs text-neutral-400">Loading creative workspaces...</p>
      </div>
    </div>
  );
}
