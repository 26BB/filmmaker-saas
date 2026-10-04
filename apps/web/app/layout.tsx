import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FilmDrop — The Direct-to-Audience Cinema Platform",
  description: "Sell and stream indie films directly to your audience. Keep 85%+ of revenue. Powered by Cloudflare Stream & Stripe Connect.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-[#08090e] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-neutral-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
