"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FilmDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "neon-solitude";

  const [selectedTier, setSelectedTier] = useState<"rent" | "buy">("buy");
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  // Mock film data
  const film = {
    title: slug === "neon-solitude" ? "Neon Solitude" : "Indie Feature Film",
    tagline: "In a cybernetic metropolis, a rogue archivist discovers the last analog human memory.",
    synopsis: "Set in Neo-Kyoto in the year 2089, Maya is a data scavenger who recovers obsolete magnetic tapes from sunken server vaults. When she intercepts an unencrypted human transmission that predates the Synthetics Accord, she becomes the prime target of the Megacity Enforcement Guild.",
    director: "Kaelen Vance",
    directorBio: "Kaelen Vance is an award-winning director based in Vancouver, specializing in high-contrast cyberpunk and philosophical speculative fiction.",
    runtime: "1h 38m (98 minutes)",
    specs: ["4K UHD (3840x2160)", "Dolby 5.1 Audio", "English Subtitles", "Closed Captions"],
    priceBuy: 14.99,
    priceRent: 4.99,
    rentalWindow: "48 hours from start of playback",
    backdropUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  };

  const handleCheckout = async () => {
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
        <img src={film.backdropUrl} alt={film.title} className="h-full w-full object-cover object-center brightness-50 filter" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090e] via-[#08090e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090e] via-transparent to-[#08090e]/60" />

        <div className="absolute bottom-10 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="amber">Sci-Fi / Cyberpunk</Badge>
              <span className="text-xs text-slate-300 font-medium">{film.runtime}</span>
              <span className="text-xs text-slate-300">• 2024</span>
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
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setSelectedTier("buy")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedTier === "buy" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Buy & Own (${film.priceBuy})
              </button>
              <button
                onClick={() => setSelectedTier("rent")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedTier === "rent" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                48h Rental (${film.priceRent})
              </button>
            </div>

            <div className="text-center py-2">
              <p className="text-3xl font-black text-white">
                ${selectedTier === "buy" ? film.priceBuy : film.priceRent}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedTier === "buy" ? "Unlimited lifetime streaming in 4K" : "48-hour viewing window"}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full text-base"
                variant="primary"
                isLoading={isLoadingCheckout}
                onClick={handleCheckout}
              >
                {selectedTier === "buy" ? "Unlock & Stream Forever" : "Rent & Watch Now"}
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                🔒 Secure 256-bit checkout via Stripe. 85% goes directly to the filmmaker.
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
