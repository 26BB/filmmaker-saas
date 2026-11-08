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
  language?: string;
  priceInrRent?: number;
  priceInrBuy?: number;
}

export function FilmCard({
  film,
  preferredCurrency = "INR",
}: {
  film: FilmItem;
  preferredCurrency?: "INR" | "USD";
}) {
  const isINR = preferredCurrency === "INR";
  
  // Format prices with INR-first benchmark or fallback calculation
  const inrRent = film.priceInrRent || Math.round((film.priceRentCents / 100) * 83);
  const inrBuy = film.priceInrBuy || Math.round((film.priceBuyCents / 100) * 83);
  const usdRent = (film.priceRentCents / 100).toFixed(2);
  const usdBuy = (film.priceBuyCents / 100).toFixed(2);

  const rentDisplay = isINR ? `₹${inrRent}` : `$${usdRent}`;
  const buyDisplay = isINR ? `₹${inrBuy}` : `$${usdBuy}`;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md hover:border-amber-400 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1">
      {/* Poster Media Wrap */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-100">
        <img
          src={film.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"}
          alt={film.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Laurels / Award / Language Badge */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          {film.language ? (
            <span className="rounded-lg bg-white/95 border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 shadow-sm backdrop-blur-md">
              {film.language}
            </span>
          ) : <span />}

          {film.ratingBadge && (
            <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-neutral-950 shadow-sm truncate max-w-[150px]">
              ★ {film.ratingBadge}
            </span>
          )}
        </div>

        {/* Duration & Year */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 text-xs font-medium text-white">
          <span className="rounded bg-black/60 px-1.5 py-0.5 backdrop-blur-md">{film.durationMinutes}m</span>
          <span>•</span>
          <span>{film.releaseYear}</span>
        </div>

        {/* Hover Quick Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            href={`/film/${film.slug}`}
            aria-hidden="true"
            tabIndex={-1}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-neutral-950 shadow-lg hover:scale-110 transition-transform"
          >
            <span className="ml-0.5 text-base" aria-hidden="true">▶</span>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="amber" className="text-[10px] uppercase tracking-wider">{film.genre}</Badge>
            <span className="text-xs text-slate-500">Dir. {film.directorName}</span>
          </div>
          <Link href={`/film/${film.slug}`}>
            <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
              {film.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{film.tagline}</p>
        </div>

        {/* Pricing / CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Rent / Own</span>
            <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
              {rentDisplay} <span className="text-slate-400">/</span> {buyDisplay}
            </span>
          </div>
          <Link
            href={`/film/${film.slug}`}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500 hover:text-white transition-colors"
          >
            Watch Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
export default FilmCard;
