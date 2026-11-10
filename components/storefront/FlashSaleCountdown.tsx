"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight, Sparkles } from "lucide-react";

export function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white border-y border-neutral-800 py-4 px-4 sm:px-6 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10 text-center md:text-left">
        {/* Left: Urgency Announcement */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide flex items-center gap-2 justify-center md:justify-start">
              <span>SPECIAL FLASH SALE</span>
              <span className="bg-brand-sale text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                FLAT 15% OFF
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Valid on all multi-category essentials across Pakistan with Free Shipping!
            </p>
          </div>
        </div>

        {/* Center: Live Digital Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Ends In:
          </span>
          <div className="flex items-center gap-1.5 font-mono">
            <div className="bg-neutral-800 border border-neutral-700/80 px-2 py-1 rounded-md text-xs font-bold text-white shadow-xs">
              {pad(timeLeft.hours)}h
            </div>
            <span className="text-neutral-500 font-bold">:</span>
            <div className="bg-neutral-800 border border-neutral-700/80 px-2 py-1 rounded-md text-xs font-bold text-white shadow-xs">
              {pad(timeLeft.minutes)}m
            </div>
            <span className="text-neutral-500 font-bold">:</span>
            <div className="bg-brand-sale border border-red-500 px-2 py-1 rounded-md text-xs font-black text-white shadow-xs animate-pulse">
              {pad(timeLeft.seconds)}s
            </div>
          </div>
        </div>

        {/* Right: Quick CTA Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 px-4 py-2 rounded-full transition-all shadow-md active:scale-95"
        >
          <span>Shop Flash Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

