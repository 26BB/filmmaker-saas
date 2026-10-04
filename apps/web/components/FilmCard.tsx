"use client";
import React from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";

export interface FilmItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  posterUrl: string;
  genre: string;
  durationMinutes: number;
  releaseYear: number;
  directorName: string;
  directorAvatar?: string;
  priceBuyCents: number;
  priceRentCents: number;
  ratingBadge?: string;
}

export function FilmCard({ film }: { film: FilmItem }) {
  const buyFormatted = (film.priceBuyCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  const rentFormatted = (film.priceRentCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-amber-500/10">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-950">
        <img
          src={film.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"}
          alt={film.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Laurels / Award Badge */}
        {film.ratingBadge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="rounded-lg bg-amber-500/90 px-2 py-1 text-[11px] font-bold text-neutral-950 backdrop-blur-md shadow-md">
              ★ {film.ratingBadge}
            </span>
          </div>
        )}

        {/* Duration & Year */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 text-xs font-medium text-slate-200">
          <span className="rounded bg-black/60 px-1.5 py-0.5 backdrop-blur-md">{film.durationMinutes}m</span>
          <span>•</span>
          <span>{film.releaseYear}</span>
        </div>

        {/* Hover Quick Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            href={`/film/${film.slug}`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-neutral-950 shadow-xl shadow-amber-500/40 hover:scale-110 transition-transform"
          >
            <span className="ml-0.5 text-base">▶</span>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="amber" className="text-[10px] uppercase tracking-wider">{film.genre}</Badge>
            <span className="text-xs text-slate-400">Dir. {film.directorName}</span>
          </div>
          <Link href={`/film/${film.slug}`}>
            <h3 className="mt-2 text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {film.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2">{film.tagline}</p>
        </div>

        {/* Pricing / CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Rent / Own</span>
            <span className="text-xs font-bold text-white">
              {rentFormatted} <span className="text-slate-400">/</span> {buyFormatted}
            </span>
          </div>
          <Link
            href={`/film/${film.slug}`}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition-colors"
          >
            Get Access
          </Link>
        </div>
      </div>
    </div>
  );
}
