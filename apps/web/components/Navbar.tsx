"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    isFilmmaker?: boolean;
  } | null;
}

export function Navbar({ user = { name: "Elena Rostova", email: "elena@indiefilm.studio", isFilmmaker: true } }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-lg font-black text-white">▶</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Film<span className="text-amber-600">Drop</span>
            </span>
          </Link>

          {/* Desktop & Tablet Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/browse" className="hover:text-amber-600 transition-colors">Browse Films</Link>
            <Link href="/library" className="hover:text-amber-600 transition-colors">My Library</Link>
            {user?.isFilmmaker && (
              <Link href="/dashboard" className="text-amber-600 hover:text-amber-700 flex items-center gap-1.5 font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Creator Studio
              </Link>
            )}
          </div>
        </div>

        {/* Right Action Icons & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/browse" className="hidden sm:flex">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search cinema...</span>
              <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">⌘K</kbd>
            </div>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full p-1 border border-slate-200 hover:border-amber-500/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name.charAt(0)}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-sm">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/library" onClick={() => setDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900">Purchases & Rentals</Link>
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900">Filmmaker Dashboard</Link>
                    <Link href="/dashboard/films/new" onClick={() => setDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-amber-700 hover:bg-amber-50 font-medium">Upload New Film</Link>
                    <Link href="/dashboard/payouts" onClick={() => setDropdownOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900">Stripe Payouts</Link>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <Link href="/login" onClick={() => setDropdownOpen(false)} className="block w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium">Sign Out</Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            <span>🔍 Browse Films</span>
          </Link>
          <Link
            href="/library"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            <span>🍿 My Library</span>
          </Link>
          {user?.isFilmmaker && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-sm font-semibold text-amber-800"
              >
                <span>🎬 Filmmaker Studio</span>
              </Link>
              <Link
                href="/dashboard/films/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2.5 text-sm font-bold text-white"
              >
                <span>+ Upload New Film</span>
              </Link>
            </>
          )}
          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full text-xs">Sign In</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full text-xs">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
