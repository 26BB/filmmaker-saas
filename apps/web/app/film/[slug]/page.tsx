"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FilmDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "neon-solitude";

  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedTier, setSelectedTier] = useState<"rent" | "buy">("rent");
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  // Film details with India-first + Global metadata
  const film = {
    title: slug === "neon-solitude" ? "Neon Solitude" : "Indie Feature Film",
    tagline: "In a cybernetic metropolis, a rogue archivist discovers the last analog human memory.",
    synopsis: "Set in Neo-Kyoto and Old Mumbai in the year 2089, Maya is an analog archivist who recovers obsolete magnetic tapes from sunken server vaults. When she intercepts an unencrypted transmission that predates the Synthetics Accord, she becomes the prime target of the Megacity Enforcement Guild.",
    director: "Kaelen Vance",
    directorBio: "Kaelen Vance is an award-winning independent director specializing in high-contrast philosophical speculative fiction and atmospheric cinema.",
    language: "Malayalam / English",
    subtitles: ["English (CC)", "Hindi", "Malayalam"],
    runtime: "1h 38m (98 minutes)",
    laurels: ["Official Selection • MAMI 2025", "Winner • IFFK Golden Crow", "Sundance 2026 Nominee"],
    specs: ["4K UHD (3840x2160)", "Dolby 5.1 Surround", "Adaptive 4G/5G Bitrate", "DRM Cloudflare Protected"],
    prices: {
      INR: { rent: 99, buy: 299 },
      USD: { rent: 4.99, buy: 14.99 },
    },
    rentalWindow: "48 hours from start of playback",
    backdropUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  };

  const currentPrice = film.prices[currency][selectedTier];

  // 1. Razorpay UPI / RuPay / NetBanking Checkout
  const handleRazorpayCheckout = async () => {
    setIsLoadingCheckout(true);
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInr: film.prices.INR[selectedTier],
          filmId: "00000000-0000-0000-0000-000000000001",
          filmTitle: film.title,
          filmSlug: slug,
          viewerId: "00000000-0000-0000-0000-000000000099",
          viewerEmail: "viewer@filmdrop.io",
          purchaseType: selectedTier,
          rentDurationHours: 48,
        }),
      });

      const data = await res.json();
      if (data?.orderId) {
        // Direct redirect to watch screen for seamless demo/staging
        window.location.href = `/watch/${slug}?order_id=${data.orderId}&provider=razorpay&success=true`;
      } else {
        window.location.href = `/watch/${slug}`;
      }
    } catch (err) {
      window.location.href = `/watch/${slug}`;
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  // 2. Stripe USD Credit Card Checkout
  const handleStripeCheckout = async () => {
    setIsLoadingCheckout(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId: "00000000-0000-0000-0000-000000000001",
          filmSlug: slug,
          purchaseType: selectedTier,
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `/watch/${slug}`;
      }
    } catch (err) {
      window.location.href = `/watch/${slug}`;
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Cinema Backdrop */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={film.backdropUrl}
          alt={film.title}
          className="h-full w-full object-cover object-center brightness-50 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090e] via-[#08090e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090e] via-transparent to-[#08090e]/60" />

        <div className="absolute bottom-10 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div>
            {/* Festival Laurels */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {film.laurels.map((laurel, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30 backdrop-blur-md"
                >
                  ✦ {laurel}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <Badge variant="amber">Sci-Fi / Speculative</Badge>
              <span className="text-xs text-slate-300 font-medium">{film.language}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-medium">{film.runtime}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">2024</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">{film.title}</h1>
            <p className="mt-2 text-lg text-slate-300 max-w-2xl">{film.tagline}</p>
          </div>

          <Button
            size="lg"
            variant="glass"
            onClick={() => setShowTrailerModal(true)}
            className="flex items-center gap-2"
          >
            <span>▶</span> Watch Official Trailer
          </Button>
        </div>
      </div>

      {/* Main Content & Checkout Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Synopsis, Specs, Director */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Synopsis</h2>
            <p className="text-slate-300 leading-relaxed text-base">{film.synopsis}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Master Specs & Deliverables</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {film.specs.map((spec, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <p className="text-xs font-semibold text-slate-200">{spec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold text-neutral-950 flex-shrink-0">
              KV
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Directed by {film.director}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{film.directorBio}</p>
              <Link href={`/filmmaker/kaelen-vance`} className="text-xs font-semibold text-amber-400 hover:text-amber-300 mt-3 inline-block">
                View Filmography →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 backdrop-blur-xl shadow-2xl shadow-amber-500/10 space-y-6">
            {/* Currency Selector */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Display Currency</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    currency === "INR" ? "bg-amber-500 text-neutral-950 shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    currency === "USD" ? "bg-amber-500 text-neutral-950 shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            {/* License Option Buttons */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setSelectedTier("rent")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedTier === "rent" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                48h Rental ({currency === "INR" ? `₹${film.prices.INR.rent}` : `$${film.prices.USD.rent}`})
              </button>
              <button
                onClick={() => setSelectedTier("buy")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedTier === "buy" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Lifetime Pass ({currency === "INR" ? `₹${film.prices.INR.buy}` : `$${film.prices.USD.buy}`})
              </button>
            </div>

            <div className="text-center py-2">
              <p className="text-3xl font-black text-white">
                {currency === "INR" ? `₹${currentPrice}` : `$${currentPrice}`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedTier === "buy" ? "Unlimited lifetime 4K streaming + Director extras" : "48-hour viewing window from start"}
              </p>
            </div>

            {/* Checkout Gateway Actions */}
            <div className="space-y-3">
              {/* Primary: Razorpay UPI for India */}
              <button
                type="button"
                onClick={handleRazorpayCheckout}
                disabled={isLoadingCheckout}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 shadow-lg shadow-emerald-500/20 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>⚡ Pay ₹{film.prices.INR[selectedTier]} with UPI / NetBanking / Cards (Razorpay)</span>
              </button>

              {/* Secondary: Stripe USD for International */}
              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={isLoadingCheckout}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>💳 Pay ${film.prices.USD[selectedTier]} with International Card (Stripe)</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 pt-1">
                🔒 Direct creator support. 85% goes directly to the filmmaker with 0% platform hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{film.title} — Official Trailer</h3>
              <button onClick={() => setShowTrailerModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>
            <div className="aspect-video">
              <video src={film.trailerUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
