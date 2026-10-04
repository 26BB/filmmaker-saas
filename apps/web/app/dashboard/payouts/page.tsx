"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PayoutsPage() {
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [isLoadingConnect, setIsLoadingConnect] = useState(false);

  const handleConnectStripe = async () => {
    setIsLoadingConnect(true);
    try {
      const res = await fetch("/api/stripe/connect/create-account", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.warn("Connect redirect fallback", e);
    } finally {
      setIsLoadingConnect(false);
    }
  };

  const handleOpenDashboard = async () => {
    try {
      const res = await fetch("/api/stripe/connect/dashboard-link", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e) {
      window.open("https://dashboard.stripe.com/express", "_blank");
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">Stripe Express Payouts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time direct payout management and earnings transfer history.
          </p>
        </div>

        {/* Connect Status Banner */}
        {isOnboarded ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Stripe Express Account Connected</h3>
                <p className="text-xs text-slate-400">Account #acct_1Nx8281... • 85% Automatic Destination Charges Active</p>
              </div>
            </div>
            <Button onClick={handleOpenDashboard} variant="outline">
              Open Stripe Express Portal ↗
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Connect Stripe to Receive Direct Payouts</h3>
              <p className="text-xs text-slate-400 mt-1">
                Stripe handles automated bank deposits in 100+ countries with KYC verification.
              </p>
            </div>
            <Button onClick={handleConnectStripe} isLoading={isLoadingConnect} variant="primary">
              Connect with Stripe Express 🚀
            </Button>
          </div>
        )}

        {/* Payout Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold">Available for Payout</CardDescription>
              <CardTitle className="text-2xl font-black text-emerald-400">$3,410.20</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-slate-400">Next auto-transfer in 2 days</span>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold">In Transit</CardDescription>
              <CardTitle className="text-2xl font-black text-white">$1,840.00</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-slate-400">Initiated Oct 2, 2026</span>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold">Lifetime Total Payouts</CardDescription>
              <CardTitle className="text-2xl font-black text-amber-400">$12,597.42</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-emerald-400">85% effective take-home</span>
            </CardContent>
          </Card>
        </div>

        {/* Transfer History */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle>Transfer History</CardTitle>
            <CardDescription>Direct bank transfers issued through Stripe Connect.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                    <th className="pb-3">Transfer ID</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Net Amount</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3.5 font-mono text-xs text-slate-400">tr_1Po829Xn8</td>
                    <td className="py-3.5 font-medium text-white">Chase Checking (•••• 8912)</td>
                    <td className="py-3.5"><Badge variant="published">Completed</Badge></td>
                    <td className="py-3.5 font-bold text-emerald-400">+$2,410.50</td>
                    <td className="py-3.5 text-right text-xs text-slate-400">Sep 28, 2026</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3.5 font-mono text-xs text-slate-400">tr_1Po412Ak9</td>
                    <td className="py-3.5 font-medium text-white">Chase Checking (•••• 8912)</td>
                    <td className="py-3.5"><Badge variant="published">Completed</Badge></td>
                    <td className="py-3.5 font-bold text-emerald-400">+$4,180.20</td>
                    <td className="py-3.5 text-right text-xs text-slate-400">Sep 21, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
