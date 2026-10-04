"use client";
import React, { useState } from "react";
import { FilmCard } from "@/components/FilmCard";
import { Input } from "@/components/ui/input";

const ALL_FILMS = [
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
    ratingBadge: "Cannes Official Selection",
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
    priceBuyCents: 1299,
    priceRentCents: 399,
    ratingBadge: "Tribeca Winner",
  },
  {
    id: "3",
    slug: "the-last-transmission",
    title: "The Last Transmission",
    tagline: "A lone deep-space radio operator intercepts a voice that shouldn't exist.",
    posterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80",
    genre: "Thriller",
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

const GENRES = ["All", "Sci-Fi", "Drama", "Documentary", "Thriller", "Mystery"];
const PRICE_FILTERS = ["All Prices", "Under $5", "$5 - $10", "$10+"];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");

  const filteredFilms = ALL_FILMS.filter((film) => {
    const matchesSearch = film.title.toLowerCase().includes(search.toLowerCase()) ||
                          film.tagline.toLowerCase().includes(search.toLowerCase()) ||
                          film.directorName.toLowerCase().includes(search.toLowerCase());

    const matchesGenre = selectedGenre === "All" || film.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    let matchesPrice = true;
    if (selectedPrice === "Under $5") {
      matchesPrice = film.priceRentCents < 500;
    } else if (selectedPrice === "$5 - $10") {
      matchesPrice = film.priceBuyCents >= 500 && film.priceBuyCents <= 1000;
    } else if (selectedPrice === "$10+") {
      matchesPrice = film.priceBuyCents > 1000;
    }

    return matchesSearch && matchesGenre && matchesPrice;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Browse Cinema Catalog</h1>
        <p className="text-sm text-slate-400 mt-1">Discover independent features, documentaries, and shorts.</p>
      </div>

      {/* Filters Bar */}
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
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Price Dropdown */}
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
        >
          {PRICE_FILTERS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filteredFilms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFilms.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-slate-800 bg-slate-900/20">
          <p className="text-lg font-bold text-slate-300">No films match your search</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your genre or keyword filters.</p>
        </div>
      )}
    </div>
  );
}
