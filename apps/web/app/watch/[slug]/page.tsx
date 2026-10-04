"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Badge } from "@/components/ui/badge";

export default function WatchRoomPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "neon-solitude";

  const [signedUrl, setSignedUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignedStream() {
      try {
        const res = await fetch("/api/stream/signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filmSlug: slug }),
        });
        const data = await res.json();
        if (data?.signedUrl) {
          setSignedUrl(data.signedUrl);
        }
      } catch (e) {
        console.warn("Using sample stream in watch room:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSignedStream();
  }, [slug]);

  const handleProgress = async (seconds: number, percent: number) => {
    // Send progress ping
    if (Math.round(seconds) % 15 === 0) {
      try {
        await fetch("/api/analytics/watch-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filmId: "00000000-0000-0000-0000-000000000001",
            watchDurationSeconds: Math.round(seconds),
            completed: percent >= 90,
          }),
        });
      } catch (err) {
        // silent fail for analytics ping
      }
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Bar inside Watch Room */}
        <div className="flex items-center justify-between text-sm">
          <Link href="/library" className="text-slate-400 hover:text-amber-400 flex items-center gap-1 font-medium">
            ← Back to My Library
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="rental">Access Active: 47h 58m remaining</Badge>
            <Badge variant="published">4K Stream Active</Badge>
          </div>
        </div>

        {/* Cinematic Video Player */}
        <VideoPlayer
          title={slug === "neon-solitude" ? "Neon Solitude" : "Indie Feature Film"}
          director="Kaelen Vance"
          streamPlaybackUrl={signedUrl || undefined}
          isWatermarked={true}
          onProgressUpdate={handleProgress}
        />

        {/* Film Meta & Creator Notes */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">{slug.replace(/-/g, " ")} (2024)</h2>
              <p className="text-xs text-slate-400 mt-1">Directed by Kaelen Vance • 4K UHD Master Stream</p>
            </div>
            <Link href={`/film/${slug}`} className="text-xs font-semibold text-amber-400 hover:underline">
              Film Details & Synopsis →
            </Link>
          </div>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Thank you for supporting independent cinema. You are watching a signed playback stream authorized for your account via Cloudflare Stream Edge.
          </p>
        </div>
      </div>
    </div>
  );
}
