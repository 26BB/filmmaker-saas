"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFilmmaker, setIsFilmmaker] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20 mb-3">
            <span className="text-xl font-black text-neutral-950">▶</span>
          </div>
          <CardTitle className="text-2xl font-black text-white">Join FilmDrop</CardTitle>
          <CardDescription>Direct-to-audience cinema distribution and streaming.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name / Studio Name</label>
              <Input
                placeholder="Elena Rostova"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <Input
                type="email"
                placeholder="elena@indiefilm.studio"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">I am an Indie Filmmaker / Studio</p>
                <p className="text-[11px] text-slate-400">Enables video uploads & Stripe Connect</p>
              </div>
              <input
                type="checkbox"
                checked={isFilmmaker}
                onChange={(e) => setIsFilmmaker(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500"
              />
            </div>

            <Button type="submit" className="w-full" variant="primary" isLoading={isLoading}>
              Create Account 🚀
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full text-xs"
            onClick={() => router.push("/dashboard")}
          >
            Google Workspace / Gmail
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
