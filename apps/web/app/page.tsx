import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilmCard } from "@/components/FilmCard";

const FEATURED_FILMS = [
  {
    id: "1",
    slug: "neon-solitude",
    title: "Neon Solitude",
    tagline: "In a cybernetic metropolis, a rogue archivist discovers the last analog human memory.",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    genre: "Sci-Fi / Cyberpunk",
    durationMinutes: 98,
    releaseYear: 2024,
    directorName: "Kaelen Vance",
    priceBuyCents: 1499,
    priceRentCents: 499,
    ratingBadge: "Cannes Official Selection",
  },
  {
    id: "2",
    slug: "whispers-in-the-valley",
    title: "Whispers in the Valley",
    tagline: "A remote Himalayan community confronts an environmental anomaly that changes reality.",
    posterUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    genre: "Atmospheric Mystery",
    durationMinutes: 114,
    releaseYear: 2024,
    directorName: "Tenzin Norbu",
    priceBuyCents: 1299,
    priceRentCents: 399,
    ratingBadge: "Tribeca Best Cinematography",
  },
  {
    id: "3",
    slug: "the-last-transmission",
    title: "The Last Transmission",
    tagline: "A lone deep-space radio operator intercepts a voice that shouldn't exist.",
    posterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80",
    genre: "Psychological Thriller",
    durationMinutes: 87,
    releaseYear: 2024,
    directorName: "Sarah Chen",
    priceBuyCents: 999,
    priceRentCents: 299,
  },
  {
    id: "4",
    slug: "analog-dreams",
    title: "Analog Dreams",
    tagline: "A 16mm portrait of Tokyo's underground ambient music pioneers.",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    genre: "Documentary",
    durationMinutes: 62,
    releaseYear: 2024,
    directorName: "Kenji Sato",
    priceBuyCents: 800,
    priceRentCents: 350,
  },
  {
    id: "5",
    slug: "dust-and-echoes",
    title: "Dust and Echoes",
    tagline: "Two estranged sisters journey across the Atacama Desert to fulfill an eccentric promise.",
    posterUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
    genre: "Drama",
    durationMinutes: 92,
    releaseYear: 2024,
    directorName: "Lucia Morales",
    priceBuyCents: 1199,
    priceRentCents: 450,
  },
  {
    id: "6",
    slug: "quantum-horizon",
    title: "Quantum Horizon",
    tagline: "When time dilation becomes currency, how much is your youth worth?",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    genre: "Sci-Fi",
    durationMinutes: 105,
    releaseYear: 2024,
    directorName: "Marcus Thorne",
    priceBuyCents: 1399,
    priceRentCents: 499,
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-8 backdrop-blur-md">
            <span>✨ The Direct TVOD Platform for Independent Filmmakers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Sell your cinema <br />
            <span className="text-gradient-amber">directly to your audience.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your film, set your own rental or purchase price, and keep 85% of every sale. Platform handles 4K streaming, DRM protection, and instant Stripe payouts.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard/films/new">
              <Button size="lg" variant="primary">Upload Your Film</Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="secondary">Browse Premieres</Button>
            </Link>
          </div>

          {/* Value Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-10">
            <div>
              <p className="text-3xl font-black text-amber-400">85%</p>
              <p className="text-xs text-slate-400 mt-1">Creator Revenue Cut</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">4K UHD</p>
              <p className="text-xs text-slate-400 mt-1">Cloudflare Stream Edge</p>
            </div>
            <div>
              <p className="text-3xl font-black text-amber-400">Instant</p>
              <p className="text-xs text-slate-400 mt-1">Stripe Direct Transfers</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">$0</p>
              <p className="text-xs text-slate-400 mt-1">Upfront Hosting Cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Premieres */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Drops</h2>
            <p className="text-sm text-slate-400 mt-1">Award-winning cinema streaming directly on FilmDrop</p>
          </div>
          <Link href="/browse" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_FILMS.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>

      {/* Why FilmDrop vs Traditional / Vimeo OTT Comparison */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white">Why Filmmakers Choose FilmDrop</h2>
            <p className="text-slate-400 mt-2">Compare how we stack up against traditional aggregators and high-fee OTT tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-lg font-bold text-slate-300">Traditional Distributors</h3>
              <p className="text-2xl font-bold text-red-400 mt-2">15% - 30%</p>
              <p className="text-xs text-slate-500">Filmmaker keeps after middleman cuts</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li>❌ 12-24 month payout delays</li>
                <li>❌ No access to customer emails</li>
                <li>❌ Multi-year lock-in contracts</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-lg font-bold text-slate-300">Vimeo OTT / Aggregators</h3>
              <p className="text-2xl font-bold text-amber-400 mt-2">$500+/mo</p>
              <p className="text-xs text-slate-500">High monthly subscription fees</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li>❌ Expensive upfront setup</li>
                <li>❌ High churn risk</li>
                <li>❌ Clunky audience onboarding</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-950/90 border border-amber-500/50 shadow-xl shadow-amber-500/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">FilmDrop</h3>
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-neutral-950">WINNER</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400 mt-2">85% Net</p>
              <p className="text-xs text-slate-400">Direct creator take-home</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-200">
                <li>✓ Instant Stripe Connect payouts</li>
                <li>✓ Direct viewer relationship</li>
                <li>✓ Free to upload, pay only when you sell</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
