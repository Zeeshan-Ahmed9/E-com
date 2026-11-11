"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPKR } from "@/lib/utils";

const SHOWCASE_PRODUCTS = [
  {
    name: "Wireless ANC Headphones",
    slug: "wireless-anc-headphones",
    salePrice: 3850,
    regularPrice: 4800,
    discountBadge: "-20%",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "4-in-1 Vegetable Chopper",
    slug: "4-in-1-vegetable-chopper",
    salePrice: 1999,
    regularPrice: 2800,
    discountBadge: "-28%",
    imageUrl:
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Smart LED Sunset Lamp",
    slug: "smart-sunset-lamp",
    salePrice: 1650,
    regularPrice: 2400,
    discountBadge: "-31%",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
  },
];

export function HeroBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: "05",
    minutes: "42",
    seconds: "18",
  });

  useEffect(() => {
    // Dynamic countdown timer
    const target = new Date();
    target.setHours(23, 59, 59, 999);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden text-white bg-gradient-to-br from-[#0B1220] via-[#1A1145] to-[#3B0F3F] border-b border-[#131C33] select-none">
      {/* Ambient Glowing Orbs */}
      <div className="absolute -top-36 -left-28 w-[420px] h-[420px] rounded-full bg-[#FF4D2E] opacity-45 blur-[90px] pointer-events-none animate-pm-orb" />
      <div className="absolute -bottom-40 -right-24 w-[400px] h-[400px] rounded-full bg-[#5B4BFF] opacity-40 blur-[90px] pointer-events-none animate-pm-orb" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Top Pill */}
            <div>
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/12 border border-white/25 text-xs font-semibold tracking-wider uppercase text-white shadow-sm backdrop-blur-xs">
                🔥 Cash on Delivery • All Over Pakistan
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-extrabold text-white leading-[1.12] tracking-tight font-sans">
              Trending Products,{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFB020] to-[#FF7A45]">
                Delivered To Your Door
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-[520px] mx-auto lg:mx-0 font-normal">
              Handpicked winning products at unbeatable prices. Order today with 100% Cash on
              Delivery and pay when it arrives at your doorstep.
            </p>

            {/* Countdown Timer Box */}
            <div className="space-y-2 pt-1">
              <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FFB020]">
                Today&apos;s Deals End In
              </span>
              <div className="inline-flex items-center gap-2">
                <div className="min-w-[56px] text-center px-2 py-1.5 rounded-xl bg-white/12 border border-white/20 backdrop-blur-md shadow-xs">
                  <b className="block text-2xl font-extrabold text-white tabular-nums leading-tight font-sans">
                    {timeLeft.hours}
                  </b>
                  <small className="block text-[10px] tracking-wider uppercase text-white/70 font-semibold">
                    Hours
                  </small>
                </div>
                <span className="text-[#FFB020] font-bold text-xl animate-pm-blink">:</span>
                <div className="min-w-[56px] text-center px-2 py-1.5 rounded-xl bg-white/12 border border-white/20 backdrop-blur-md shadow-xs">
                  <b className="block text-2xl font-extrabold text-white tabular-nums leading-tight font-sans">
                    {timeLeft.minutes}
                  </b>
                  <small className="block text-[10px] tracking-wider uppercase text-white/70 font-semibold">
                    Mins
                  </small>
                </div>
                <span className="text-[#FFB020] font-bold text-xl animate-pm-blink">:</span>
                <div className="min-w-[56px] text-center px-2 py-1.5 rounded-xl bg-white/12 border border-white/20 backdrop-blur-md shadow-xs">
                  <b className="block text-2xl font-extrabold text-white tabular-nums leading-tight font-sans">
                    {timeLeft.seconds}
                  </b>
                  <small className="block text-[10px] tracking-wider uppercase text-white/70 font-semibold">
                    Secs
                  </small>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#FF4D2E] to-[#FF7A45] shadow-[0_10px_28px_rgba(255,77,46,0.45)] hover:shadow-[0_14px_34px_rgba(255,77,46,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Shop Now &rarr;</span>
              </Link>
              <Link
                href="#all-collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white/90 border border-white/30 hover:bg-white/10 hover:text-white transition-all duration-200 backdrop-blur-xs cursor-pointer"
              >
                <span>Browse Categories</span>
              </Link>
            </div>

            {/* Chips row */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-white/90 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <i className="not-italic text-[#12B76A] font-extrabold text-sm">✓</i>
                Cash on Delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="not-italic text-[#12B76A] font-extrabold text-sm">✓</i>
                Nationwide Delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="not-italic text-[#12B76A] font-extrabold text-sm">✓</i>
                Easy Replacement
              </span>
            </div>
          </div>

          {/* Right Column (Zuu Signature 3-Product Floating Stack) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Mega Sale Burst Badge */}
            <div className="absolute -top-7 -right-2 sm:-right-4 z-20 w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD34D] via-[#FFB020] to-[#FF8A00] text-[#7A1200] flex flex-col items-center justify-center font-black text-center shadow-lg animate-pm-burst select-none">
              <small className="text-[9px] tracking-wider uppercase font-bold leading-none">
                MEGA SALE
              </small>
              <span className="text-xs uppercase font-extrabold leading-none mt-0.5">UP TO</span>
              <b className="text-xl font-black leading-none">50%</b>
              <small className="text-[9px] font-extrabold leading-none">OFF</small>
            </div>

            {/* 3-Card Grid Stack */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {SHOWCASE_PRODUCTS.map((prod, idx) => (
                <Link
                  key={prod.slug}
                  href={`/products/${prod.slug}`}
                  className={`relative block bg-white rounded-2xl p-2 sm:p-2.5 text-[#0B1220] shadow-[0_16px_36px_rgba(0,0,0,0.35)] hover:-translate-y-2 hover:shadow-[0_22px_44px_rgba(0,0,0,0.45)] transition-all duration-300 group cursor-pointer ${
                    idx === 1 ? "mt-5 sm:mt-7" : ""
                  }`}
                >
                  {/* Discount ribbon */}
                  <span className="absolute top-2 left-2 z-10 bg-[#FF4D2E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    {prod.discountBadge}
                  </span>

                  {/* Image */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 mb-2">
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 33vw, 15vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <b className="block text-[11px] sm:text-xs font-bold text-[#0B1220] leading-snug line-clamp-2 min-h-[32px] group-hover:text-[#FF4D2E] transition-colors">
                    {prod.name}
                  </b>

                  {/* Price */}
                  <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-[13px] font-black text-[#FF4D2E]">
                      {formatPKR(prod.salePrice)}
                    </span>
                    <s className="text-[10px] text-[#8A92A6]">
                      {formatPKR(prod.regularPrice)}
                    </s>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
