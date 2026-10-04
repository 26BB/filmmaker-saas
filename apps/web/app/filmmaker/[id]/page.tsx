"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FilmCard } from "@/components/FilmCard";
import { Button } from "@/components/ui/button";

export default function FilmmakerProfilePage() {
  const params = useParams();
  const filmmaker = {
    name: "Kaelen Vance",
    handle: "@kaelenvance",
    location: "Vancouver, BC",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    bio: "Independent speculative fiction director and screenwriter. Exploring transhumanism, tactile cyberpunk atmospheres, and analog memory preservation in high-contrast 4K.",
    totalFilms: 3,
    totalAwards: 5,
    films: [
      {
        id: "1",
        slug: "neon-solitude",
        title: "Neon Solitude",
        tagline: "In a cybernetic metropolis, a rogue archivist discovers the last analog human memory.",
        posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
        genre: "Sci-Fi",
        durationMinutes: 98,
        releaseYear: 2024,
        directorName: "Kaelen Vance",
        priceBuyCents: 1499,
        priceRentCents: 499,
        ratingBadge: "Cannes 2024",
      },
      {
        id: "2",
        slug: "solar-winds",
        title: "Solar Winds",
        tagline: "A deep atmospheric journey across humanity's furthest deep space orbital relay.",
        posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        genre: "Sci-Fi",
        durationMinutes: 82,
        releaseYear: 2023,
        directorName: "Kaelen Vance",
        priceBuyCents: 999,
        priceRentCents: 399,
      },
    ],
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Creator Header */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 backdrop-blur-xl">
          <div className="h-28 w-28 rounded-2xl overflow-hidden border-2 border-amber-500/40 flex-shrink-0">
            <img src={filmmaker.avatar} alt={filmmaker.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white">{filmmaker.name}</h1>
                <p className="text-xs text-amber-400 font-mono mt-0.5">{filmmaker.handle} • {filmmaker.location}</p>
              </div>
              <Button variant="secondary" size="sm">Follow Filmmaker</Button>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{filmmaker.bio}</p>

            <div className="flex items-center justify-center md:justify-start gap-6 pt-2 text-xs font-semibold text-slate-400">
              <span>{filmmaker.totalFilms} Direct Drops</span>
              <span>•</span>
              <span>{filmmaker.totalAwards} Festival Laurels</span>
              <span>•</span>
              <span className="text-emerald-400">Verified Direct Creator</span>
            </div>
          </div>
        </div>

        {/* Filmography Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Releases & Premieres</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filmmaker.films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
