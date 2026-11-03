import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  BadgeDollarSign,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function HostGuarantee() {
  return (
    <section id="about-us" className="py-24 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00897b]/10 text-[#00897b] dark:text-[#80cbc4] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Host Protection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.15]">
              Turn Empty Studio Hours into Reliable Income
            </h2>

            <p className="text-[16px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
              Join thousands of photo loft owners, audio engineers, and soundstage managers earning an average of $3,800 each month by opening their creative spaces to verified production crews.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="h-6 w-6 rounded-full bg-[#00897b]/10 dark:bg-[#00897b]/20 text-[#00897b] dark:text-[#80cbc4] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    $1,000,000 Host Damage Coverage
                  </h4>
                  <p className="text-[15px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Your lighting, audio gear, and cyclorama walls are protected against accidental damage during every booked session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-6 w-6 rounded-full bg-[#00897b]/10 dark:bg-[#00897b]/20 text-[#00897b] dark:text-[#80cbc4] flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    Strict Creator Verification
                  </h4>
                  <p className="text-[15px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Every renter is required to complete government ID checks and credit card verification before making a reservation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-6 w-6 rounded-full bg-[#00897b]/10 dark:bg-[#00897b]/20 text-[#00897b] dark:text-[#80cbc4] flex items-center justify-center shrink-0 mt-0.5">
                  <BadgeDollarSign className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    Automated Direct Payouts
                  </h4>
                  <p className="text-[15px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Earnings are deposited straight into your bank account 24 hours after each session concludes with zero payout delays.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/add-studio"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white text-[16px] font-bold shadow-lg shadow-[#00897b]/20 transition-all cursor-pointer"
              >
                <span>List Your Studio Space</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-neutral-900 h-[480px]">
              <Image
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80"
                alt="Studio space hosting"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

              <div className="absolute top-5 right-5 p-3 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-[#00897b]" />
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase">Protection</div>
                  <div className="text-sm font-extrabold text-neutral-900 dark:text-white">$1M Guarantee</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                      Top Earner Average
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Based on 35 booked hours / month
                    </p>
                  </div>
                  <span className="text-2xl font-black text-[#00897b]">
                    $3,850<span className="text-xs font-normal text-neutral-500">/mo</span>
                  </span>
                </div>

                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00897b] h-full rounded-full w-[88%]" />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-neutral-500">
                  <span>Capacity Filled: 88%</span>
                  <span>Host Rating: 4.9 ★</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}