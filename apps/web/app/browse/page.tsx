"use client";
import React, { useState } from "react";
import { FilmCard, FilmItem } from "@/components/FilmCard";
import { Input } from "@/components/ui/input";

const ALL_FILMS: FilmItem[] = [
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
    language: "Malayalam",
    priceBuyCents: 1499,
    priceRentCents: 499,
    priceInrRent: 99,
    priceInrBuy: 299,
    ratingBadge: "MAMI 2025 • IFFK Winner",
  },
  {
    id: "2",
    slug: "whispers-in-the-valley",
    title: "Whispers in the Valley",
    tagline: "A remote Himalayan community confronts an environmental anomaly that changes reality.",
    posterUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    genre: "Mystery",
    durationMinutes: 114,
    releaseYear: 2024,
    directorName: "Tenzin Norbu",
    language: "Hindi",
    priceBuyCents: 1299,
    priceRentCents: 399,
    priceInrRent: 99,
    priceInrBuy: 249,
    ratingBadge: "Tribeca Winner",
  },
  {
    id: "3",
    slug: "dhool-and-whispers",
    title: "Dhool & Whispers",
    tagline: "An investigative journey across the historic textile mills of Solapur.",
    posterUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
    genre: "Drama",
    durationMinutes: 92,
    releaseYear: 2025,
    directorName: "Ananya Deshmukh",
    language: "Marathi",
    priceBuyCents: 999,
    priceRentCents: 299,
    priceInrRent: 79,
    priceInrBuy: 199,
    ratingBadge: "Sundance 2026 Nominee",
  },
  {
    id: "4",
    slug: "kaveri-chronicles",
    title: "Kaveri Chronicles",
    tagline: "A coastal village navigates changing tides and generations of untold stories.",
    posterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80",
    genre: "Drama",
    durationMinutes: 105,
    releaseYear: 2024,
    directorName: "Siddharth Raman",
    language: "Tamil",
    priceBuyCents: 1099,
    priceRentCents: 349,
    priceInrRent: 89,
    priceInrBuy: 229,
    ratingBadge: "National Award Selection",
  },
  {
    id: "5",
    slug: "the-last-transmission",
    title: "The Last Transmission",
    tagline: "A lone deep-space radio operator intercepts a voice that shouldn't exist.",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    genre: "Thriller",
    durationMinutes: 87,
    releaseYear: 2024,
    directorName: "Sarah Chen",
    language: "English",
    priceBuyCents: 999,
    priceRentCents: 299,
    priceInrRent: 99,
    priceInrBuy: 199,
  },
  {
    id: "6",
    slug: "analog-dreams",
    title: "Analog Dreams",
    tagline: "A 16mm portrait of underground ambient cassette pioneers.",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    genre: "Documentary",
    durationMinutes: 62,
    releaseYear: 2024,
    directorName: "Kenji Sato",
    language: "English",
    priceBuyCents: 800,
    priceRentCents: 350,
    priceInrRent: 79,
    priceInrBuy: 179,
  }
];

const LANGUAGES = ["All", "Malayalam", "Hindi", "Marathi", "Tamil", "English"];
const GENRES = ["All", "Sci-Fi", "Drama", "Documentary", "Thriller", "Mystery"];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [preferredCurrency, setPreferredCurrency] = useState<"INR" | "USD">("INR");

  const filteredFilms = ALL_FILMS.filter((film) => {
    const matchesSearch =
      film.title.toLowerCase().includes(search.toLowerCase()) ||
      film.tagline.toLowerCase().includes(search.toLowerCase()) ||
      film.directorName.toLowerCase().includes(search.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "All" ||
      (film.language && film.language.toLowerCase() === selectedLanguage.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" ||
      film.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesLanguage && matchesGenre;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Browse Independent Cinema</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover festival-accredited features, documentaries, and regional masterworks.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Display Currency</span>
          <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setPreferredCurrency("INR")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                preferredCurrency === "INR" ? "bg-amber-500 text-neutral-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setPreferredCurrency("USD")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                preferredCurrency === "USD" ? "bg-amber-500 text-neutral-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      {/* Regional Language Filter Pills */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
          Filter by Language
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedLanguage === lang
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar: Search & Genre */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by title, director, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Genre Tabs */}
        <div className="flex flex-wrap gap-2 items-center">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedGenre === genre
                  ? "bg-slate-700 text-white font-bold"
                  : "bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Film Grid */}
      {filteredFilms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFilms.map((film) => (
            <FilmCard key={film.id} film={film} preferredCurrency={preferredCurrency} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-slate-800 bg-slate-900/20">
          <p className="text-lg font-bold text-slate-300">No films match your search or filter</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting &apos;All&apos; languages or resetting your keywords.</p>
        </div>
      )}
    </div>
  );
}
