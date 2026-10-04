import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-12 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 font-black text-sm">
                ▶
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Film<span className="text-amber-400">Drop</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier direct-to-audience video-on-demand platform for independent filmmakers. Keep 85% of your sales with zero monthly hosting fees.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/browse" className="hover:text-amber-400 transition-colors">Browse Premieres</Link></li>
              <li><Link href="/browse?genre=documentary" className="hover:text-amber-400 transition-colors">Documentaries</Link></li>
              <li><Link href="/browse?genre=sci-fi" className="hover:text-amber-400 transition-colors">Sci-Fi & Cyberpunk</Link></li>
              <li><Link href="/browse?genre=drama" className="hover:text-amber-400 transition-colors">Award Winning Dramas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">For Filmmakers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/films/new" className="hover:text-amber-400 transition-colors">Upload a Film</Link></li>
              <li><Link href="/dashboard/payouts" className="hover:text-amber-400 transition-colors">Stripe Express Payouts</Link></li>
              <li><Link href="/docs/PLAN.md" className="hover:text-amber-400 transition-colors">Platform Economics</Link></li>
              <li><Link href="/signup" className="hover:text-amber-400 transition-colors">Create Creator Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Economics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              85% Filmmaker / 15% Platform Split. Powered by Cloudflare Stream 4K DRM and Stripe Connect Express.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 font-mono">
              ● All systems operational
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FilmDrop Inc. Built for independent cinema.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-300">Terms of Service</span>
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-300">DMCA Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
