"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FilmmakerDashboard() {
  const stats = [
    { title: "Gross Revenue", value: "$14,820.50", delta: "+24.5% vs last month" },
    { title: "Filmmaker Net (85%)", value: "$12,597.42", delta: "Direct to Stripe Connect" },
    { title: "Total Plays & Sales", value: "1,248", delta: "+18.2%" },
    { title: "Active Rentals", value: "86", delta: "Currently streaming" },
  ];

  const recentSales = [
    { id: "TX-901", film: "Neon Solitude", buyer: "alex.m@gmail.com", type: "Purchase", amount: "$14.99", time: "12m ago" },
    { id: "TX-902", film: "Neon Solitude", buyer: "cinemafan@proton.me", type: "48h Rental", amount: "$4.99", time: "34m ago" },
    { id: "TX-903", film: "The Last Transmission", buyer: "jordan@studio.io", type: "Purchase", amount: "$9.99", time: "1h ago" },
    { id: "TX-904", film: "Analog Dreams", buyer: "claire.doc@arts.org", type: "Purchase", amount: "$8.00", time: "3h ago" },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Filmmaker Studio</h1>
            <p className="text-sm text-slate-400 mt-1">Direct-to-audience sales, analytics, and film management.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/films">
              <Button variant="secondary">Manage Films</Button>
            </Link>
            <Link href="/dashboard/films/new">
              <Button variant="primary">+ Upload New Film</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-slate-800 bg-slate-900/60">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {stat.title}
                </CardDescription>
                <CardTitle className="text-2xl font-black text-white">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-semibold text-emerald-400">
                  {stat.delta}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sales Table */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>Real-time purchases and rentals from your audience.</CardDescription>
            </div>
            <Link href="/dashboard/payouts">
              <Button variant="ghost" size="sm" className="text-amber-400">View Payouts →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Film Title</th>
                    <th className="pb-3">Viewer</th>
                    <th className="pb-3">Format</th>
                    <th className="pb-3">Gross</th>
                    <th className="pb-3">Your Cut (85%)</th>
                    <th className="pb-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {recentSales.map((sale) => {
                    const gross = parseFloat(sale.amount.replace("$", ""));
                    const net = (gross * 0.85).toFixed(2);
                    return (
                      <tr key={sale.id} className="hover:bg-slate-800/30">
                        <td className="py-3.5 font-mono text-xs text-slate-400">{sale.id}</td>
                        <td className="py-3.5 font-semibold text-white">{sale.film}</td>
                        <td className="py-3.5 text-xs text-slate-400">{sale.buyer}</td>
                        <td className="py-3.5">
                          <Badge variant={sale.type === "Purchase" ? "buy" : "rental"}>
                            {sale.type}
                          </Badge>
                        </td>
                        <td className="py-3.5 font-semibold text-white">{sale.amount}</td>
                        <td className="py-3.5 font-semibold text-emerald-400">+${net}</td>
                        <td className="py-3.5 text-right text-xs text-slate-400">{sale.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
