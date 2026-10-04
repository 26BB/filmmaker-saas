"use client";
import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  const libraryItems = [
    {
      id: "1",
      slug: "neon-solitude",
      title: "Neon Solitude",
      type: "48h Rental",
      expiresIn: "47h 12m remaining",
      posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
      director: "Kaelen Vance",
      duration: "98m",
      progressPercent: 45,
    },
    {
      id: "2",
      slug: "the-last-transmission",
      title: "The Last Transmission",
      type: "Owned",
      expiresIn: "Lifetime Ownership",
      posterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80",
      director: "Sarah Chen",
      duration: "87m",
      progressPercent: 100,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-white">My Film Library</h1>
        <p className="text-sm text-slate-400 mt-1">Your unlocked premieres, rentals, and permanent purchases.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryItems.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="relative aspect-[2/3] w-24 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <Badge variant={item.type === "Owned" ? "buy" : "rental"}>{item.type}</Badge>
                  <h3 className="text-base font-bold text-white mt-1.5 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-400">Dir. {item.director} • {item.duration}</p>
                </div>
                <p className="text-xs font-medium text-amber-400">{item.expiresIn}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {item.progressPercent === 100 ? "✓ Watched" : `Progress: ${item.progressPercent}%`}
              </span>
              <Link href={`/watch/${item.slug}`}>
                <Button size="sm" variant="primary">
                  {item.progressPercent > 0 && item.progressPercent < 100 ? "Resume ▶" : "Watch Now ▶"}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
