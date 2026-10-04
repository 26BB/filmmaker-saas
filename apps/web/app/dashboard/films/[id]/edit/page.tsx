"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EditFilmPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "Neon Solitude",
    slug: "neon-solitude",
    tagline: "In a cybernetic metropolis, a rogue archivist discovers the last analog human memory.",
    description: "Set in Neo-Kyoto in the year 2089, Maya is a data scavenger who recovers obsolete magnetic tapes from sunken server vaults. When she intercepts an unencrypted human transmission that predates the Synthetics Accord, she becomes the prime target of the Megacity Enforcement Guild.",
    genre: "Sci-Fi",
    buyPrice: "14.99",
    rentPrice: "4.99",
    status: "published",
  });

  const handleSave = () => {
    router.push("/dashboard/films");
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link href="/dashboard/films" className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 mb-2">
            ← Back to Catalog
          </Link>
          <h1 className="text-3xl font-black text-white">Edit Film Details</h1>
          <p className="text-sm text-slate-400 mt-1">Update title, synopsis, pricing, or publish status.</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle>Metadata & Pricing</CardTitle>
            <CardDescription>Changes will update live across the FilmDrop network.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Film Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">URL Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status</label>
                <select
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tagline</label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Synopsis</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Buy Price (USD)</label>
                <Input
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rent Price (USD)</label>
                <Input
                  value={formData.rentPrice}
                  onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
              <Link href="/dashboard/films">
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button onClick={handleSave} variant="primary">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
