"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TusUploader } from "@/components/TusUploader";

export default function NewFilmPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    genre: "Drama",
    releaseYear: 2024,
    buyPrice: "14.99",
    rentPrice: "4.99",
    cfVideoUid: "",
  });

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  const handlePublish = () => {
    router.push("/dashboard/films");
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link href="/dashboard/films" className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 mb-2">
            ← Back to Catalog
          </Link>
          <h1 className="text-3xl font-black text-white">Upload New Film</h1>
          <p className="text-sm text-slate-400 mt-1">
            Deliver your 4K master directly to Cloudflare Stream with automatic adaptive bitrate encoding.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-4">
          <div className={`text-xs font-bold pb-1 ${step >= 1 ? "text-amber-400 border-b-2 border-amber-500" : "text-slate-500"}`}>
            1. Metadata & Specs
          </div>
          <div className={`text-xs font-bold pb-1 ${step >= 2 ? "text-amber-400 border-b-2 border-amber-500" : "text-slate-500"}`}>
            2. Master Video Upload
          </div>
          <div className={`text-xs font-bold pb-1 ${step >= 3 ? "text-amber-400 border-b-2 border-amber-500" : "text-slate-500"}`}>
            3. Pricing & Launch
          </div>
        </div>

        {/* Step 1: Metadata */}
        {step === 1 && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle>Film Information</CardTitle>
              <CardDescription>Enter the title, synopsis, and metadata for your film's public page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Film Title *</label>
                <Input
                  placeholder="e.g. Neon Solitude"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setFormData({ ...formData, title, slug });
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">URL Slug *</label>
                  <Input
                    placeholder="neon-solitude"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <span className="text-[11px] text-slate-500">filmdrop.tv/film/{formData.slug || "slug"}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Genre</label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  >
                    <option value="Sci-Fi">Sci-Fi / Cyberpunk</option>
                    <option value="Drama">Drama</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Thriller">Psychological Thriller</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">One-line Tagline</label>
                <Input
                  placeholder="In a cybernetic metropolis, a rogue archivist discovers the last analog human memory."
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Synopsis</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  placeholder="Write the full synopsis and story overview..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} variant="primary">Next: Upload Video →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Upload Video */}
        {step === 2 && (
          <Card className="border-slate-800 bg-slate-900/60 space-y-6">
            <CardHeader>
              <CardTitle>Upload 4K Master Video & Trailer</CardTitle>
              <CardDescription>
                Files are uploaded directly to Cloudflare Stream edge nodes using chunked, resumable TUS protocol.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Feature Film Master</h4>
                <TusUploader
                  label="Upload Master Film File (MP4, MOV, ProRes up to 50 GB)"
                  onUploadComplete={(uid) => setFormData({ ...formData, cfVideoUid: uid })}
                />
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Trailer / Teaser (Public Preview)</h4>
                <TusUploader
                  label="Upload Film Trailer (Recommended: 1080p / 4K under 2GB)"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary">← Back</Button>
                <Button onClick={handleNext} variant="primary">Next: Set Pricing →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Pricing & Launch */}
        {step === 3 && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle>Pricing & Monetization</CardTitle>
              <CardDescription>Set your direct TVOD rental and ownership pricing. You keep 85% of all sales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lifetime Buy Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400 text-sm">$</span>
                    <Input
                      className="pl-7"
                      placeholder="14.99"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    You receive: ${(parseFloat(formData.buyPrice || "0") * 0.85).toFixed(2)} per purchase
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">48-Hour Rental Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400 text-sm">$</span>
                    <Input
                      className="pl-7"
                      placeholder="4.99"
                      value={formData.rentPrice}
                      onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    You receive: ${(parseFloat(formData.rentPrice || "0") * 0.85).toFixed(2)} per rental
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300">
                <p className="font-bold mb-1">⚡ Automatic Stripe Connect Transfer</p>
                <p>
                  When a viewer completes checkout, 85% is instantly deposited to your Stripe account. FilmDrop handles Cloudflare streaming bandwidth and delivery costs.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <Button onClick={handleBack} variant="secondary">← Back</Button>
                <Button onClick={handlePublish} variant="primary">Publish Film Drop 🚀</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
