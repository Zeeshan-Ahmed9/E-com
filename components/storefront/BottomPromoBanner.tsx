"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function BottomPromoBanner() {
  return (
    <section className="bg-gradient-to-r from-[#FF4D2E] to-[#C2185B] text-white py-12 md:py-16 text-center select-none shadow-md">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD34D]" />
          <span>Limited Time Flash Sale</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans max-w-2xl mx-auto leading-tight">
          Grab Trending Everyday Items at Unbeatable Prices
        </h2>

        <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto font-normal">
          Enjoy 100% Free Nationwide Delivery and Cash on Delivery on all orders.
        </p>

        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-[#0B1220] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.25)] hover:bg-[#F6F7FB] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Shop Today&apos;s Deals</span>
            <ArrowRight className="w-4 h-4 text-[#FF4D2E]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

