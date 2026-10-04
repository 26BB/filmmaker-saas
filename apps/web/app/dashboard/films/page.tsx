"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FilmmakerFilmsPage() {
  const films = [
    {
      id: "1",
      slug: "neon-solitude",
      title: "Neon Solitude",
      status: "published" as const,
      buyPrice: "$14.99",
      rentPrice: "$4.99",
      views: 3420,
      sales: 412,
      revenue: "$4,832.10",
      releaseYear: 2024,
    },
    {
      id: "2",
      slug: "the-last-transmission",
      title: "The Last Transmission",
      status: "published" as const,
      buyPrice: "$9.99",
      rentPrice: "$2.99",
      views: 1890,
      sales: 245,
      revenue: "$1,980.50",
      releaseYear: 2024,
    },
    {
      id: "3",
      slug: "solar-winds",
      title: "Solar Winds (Director's Cut)",
      status: "processing" as const,
      buyPrice: "$12.00",
      rentPrice: "$3.99",
      views: 0,
      sales: 0,
      revenue: "$0.00",
      releaseYear: 2025,
    },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Film Catalog</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your film master uploads, pricing, and live listings.</p>
          </div>
          <Link href="/dashboard/films/new">
            <Button variant="primary">+ Upload New Film</Button>
          </Link>
        </div>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle>Your Titles</CardTitle>
            <CardDescription>All titles distributed under your filmmaker studio account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Pricing (Rent / Buy)</th>
                    <th className="pb-3">Views</th>
                    <th className="pb-3">Sales</th>
                    <th className="pb-3">Gross Revenue</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {films.map((film) => (
                    <tr key={film.id} className="hover:bg-slate-800/30">
                      <td className="py-4 font-semibold text-white">
                        <Link href={`/film/${film.slug}`} className="hover:text-amber-400">
                          {film.title}
                        </Link>
                      </td>
                      <td className="py-4">
                        <Badge variant={film.status}>{film.status}</Badge>
                      </td>
                      <td className="py-4 text-xs font-mono text-slate-300">
                        {film.rentPrice} / {film.buyPrice}
                      </td>
                      <td className="py-4 text-xs">{film.views.toLocaleString()}</td>
                      <td className="py-4 text-xs font-semibold text-white">{film.sales}</td>
                      <td className="py-4 font-semibold text-emerald-400">{film.revenue}</td>
                      <td className="py-4 text-right space-x-2">
                        <Link href={`/dashboard/films/${film.id}/edit`}>
                          <Button size="sm" variant="secondary">Edit</Button>
                        </Link>
                        <Link href={`/film/${film.slug}`}>
                          <Button size="sm" variant="ghost">View Live</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
