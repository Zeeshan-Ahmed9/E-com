"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Star,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Zap,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface HeroSlide {
  id: string;
  tag: string;
  categoryName: string;
  categorySlug: string;
  headline: string;
  accentText: string;
  productName: string;
  productSlug: string;
  description: string;
  salePrice: number;
  regularPrice: number;
  discountBadge: string;
  rating: number;
  reviewsCount: number;
  perks: string[];
  imageUrl: string;
  glowGradient: string;
  accentColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-electronics",
    tag: "🔥 BESTSELLER TECH • FLAT 15% OFF",
    categoryName: "Electronics",
    categorySlug: "electronics",
    headline: "STUDIO-GRADE SOUND.",
    accentText: "ZERO DISTRACTIONS.",
    productName: "Wireless ANC Over-Ear Headphones",
    productSlug: "wireless-anc-headphones",
    description:
      "Hybrid Active Noise Cancellation with 40mm deep bass drivers and 45-hour battery life. Designed for daily comfort, clear calls, and uninterrupted focus.",
    salePrice: 3850,
    regularPrice: 4800,
    discountBadge: "FLAT 15% OFF",
    rating: 4.9,
    reviewsCount: 148,
    perks: ["Hybrid Active Noise Cancelling", "45-Hour Ultra-Long Playtime", "Fast USB-C Quick Charging"],
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    glowGradient: "from-amber-500/25 via-orange-500/10 to-transparent",
    accentColor: "text-amber-400",
  },
  {
    id: "slide-kitchen",
    tag: "🍳 TOP KITCHEN INNOVATION",
    categoryName: "Kitchen & Dining",
    categorySlug: "kitchen-dining",
    headline: "PREP SMART & FAST.",
    accentText: "EFFORTLESS COOKING.",
    productName: "Multi-Functional 4-in-1 Vegetable Slicer & Dicer",
    productSlug: "4-in-1-vegetable-chopper",
    description:
      "Cut meal prep time in half with 4 interchangeable German stainless steel blades, a non-slip container, and a protective finger guard.",
    salePrice: 1999,
    regularPrice: 2800,
    discountBadge: "FLAT 15% OFF",
    rating: 4.8,
    reviewsCount: 212,
    perks: ["4 Sharp Stainless Blades", "Non-Slip Catch Basin", "Protective Finger Safety Guard"],
    imageUrl:
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=1200&auto=format&fit=crop",
    glowGradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
    accentColor: "text-emerald-400",
  },
  {
    id: "slide-home",
    tag: "✨ VIRAL HOME AESTHETIC",
    categoryName: "Home Products",
    categorySlug: "home-products",
    headline: "GOLDEN HOUR GLOW.",
    accentText: "ANYTIME AT HOME.",
    productName: "Smart LED Sunset Projection Ambient Lamp",
    productSlug: "smart-sunset-lamp",
    description:
      "Transform any room with 16 romantic sunset RGB color modes, a 180° rotatable head, and wireless remote control. Perfect for cozy evenings and photo shoots.",
    salePrice: 1650,
    regularPrice: 2400,
    discountBadge: "FLAT 15% OFF",
    rating: 4.9,
    reviewsCount: 186,
    perks: ["16 Romantic RGB Mood Colors", "Wireless Remote Control", "180° Adjustable Angle"],
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop",
    glowGradient: "from-rose-500/25 via-amber-500/10 to-transparent",
    accentColor: "text-rose-400",
  },
  {
    id: "slide-toys",
    tag: "🏎️ HIGH-SPEED ACTION FOR KIDS",
    categoryName: "Toys & Games",
    categorySlug: "toys-games",
    headline: "360° STUNT THRILLS.",
    accentText: "ALL-TERRAIN ACTION.",
    productName: "High-Speed 4WD Stunt Remote Control Car",
    productSlug: "remote-control-stunt-car",
    description:
      "Double-sided tumbling RC car with 360° high-speed rotation, heavy shock-absorbing rubber wheels, front LED lights, and 2 rechargeable battery packs.",
    salePrice: 2750,
    regularPrice: 3500,
    discountBadge: "FLAT 15% OFF",
    rating: 4.9,
    reviewsCount: 94,
    perks: ["360° Tumbling & Flips", "Dual Battery Packs Included", "Crash-Resistant Oversized Tires"],
    imageUrl:
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=1200&auto=format&fit=crop",
    glowGradient: "from-cyan-500/25 via-blue-500/10 to-transparent",
    accentColor: "text-cyan-400",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = HERO_SLIDES[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Autoplay management
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const savings = currentSlide.regularPrice - currentSlide.salePrice;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#0A0D14] text-white border-b border-neutral-900 transition-colors duration-700 select-none"
    >
      {/* 1. Dynamic Ambient Radial Lighting matching active slide */}
      <div
        className={`absolute -top-32 left-1/4 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none transition-all duration-1000`}
      />
      <div
        className={`absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl ${currentSlide.glowGradient} blur-3xl pointer-events-none transition-all duration-1000 opacity-70`}
      />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-neutral-900/40 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Overlay Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        {/* Top Trust Micro-Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 md:pb-8 border-b border-neutral-800/60 text-xs text-neutral-400">
          <div className="inline-flex items-center gap-2 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-300 font-semibold uppercase tracking-wider text-[11px]">
              ZappMart Live Deals — Pakistan
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] uppercase tracking-wider font-semibold text-neutral-300">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              100% Free Nationwide Delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              100% Cash On Delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              7-Day Checking Warranty
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-neutral-500 font-bold px-1">
              0{currentIndex + 1} / 0{HERO_SLIDES.length}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Slide Carousel Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-center pt-4 md:pt-10"
          >
            {/* 1. Visual 3D Product Showcase (Shown first on mobile with order-first, 5 cols on desktop with lg:order-last) */}
            <div className="order-first lg:order-last lg:col-span-5 w-full flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-md lg:max-w-none group">
                {/* Visual Image Podium */}
                <div className="relative h-[260px] sm:h-[340px] lg:h-[420px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-800/80 to-neutral-950 border border-neutral-800/90 shadow-2xl">
                  <Image
                    src={currentSlide.imageUrl}
                    alt={currentSlide.productName}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Vignette Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Floating Badge: FLAT 15% OFF */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-brand-sale text-white text-[11px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-lg border border-red-500/50">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      {currentSlide.discountBadge}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <span className="inline-flex items-center bg-black/60 backdrop-blur-md text-neutral-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full border border-white/10">
                      {currentSlide.categoryName}
                    </span>
                  </div>

                  {/* Bottom Floating Info Pill inside Image */}
                  <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-10 flex items-center justify-between gap-2 bg-neutral-950/85 backdrop-blur-md border border-neutral-800/90 rounded-xl p-2.5 sm:p-3 shadow-lg">
                    <div className="min-w-0">
                      <div className="text-[11px] sm:text-xs font-bold text-white truncate">
                        {currentSlide.productName}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span>✓ In Stock</span>
                        <span className="text-neutral-500">•</span>
                        <span>Free Delivery</span>
                      </div>
                    </div>
                    <Link
                      href={`/checkout?buyNow=${currentSlide.productSlug}&qty=1`}
                      className="bg-white hover:bg-neutral-200 text-black text-[11px] sm:text-xs font-extrabold uppercase px-3 sm:px-3.5 py-1.5 rounded-lg shrink-0 transition active:scale-95 shadow-sm"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>

                {/* Ambient Soft Glow underneath */}
                <div
                  className={`absolute -bottom-4 inset-x-8 h-10 bg-gradient-to-r ${currentSlide.glowGradient} blur-xl opacity-60 pointer-events-none`}
                />
              </div>
            </div>

            {/* 2. Text Content Details (7 cols on desktop, after image on mobile) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left w-full">
              {/* Promotional Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-800/90 rounded-full px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-200">
                  {currentSlide.tag}
                </span>
                <span className="bg-brand-sale text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ml-1">
                  SAVE {formatPKR(savings)}
                </span>
              </div>

              {/* Big Punchy Headline */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-[1.1] font-sans">
                  {currentSlide.headline}{" "}
                  <span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400"
                  >
                    {currentSlide.accentText}
                  </span>
                </h1>
              </div>

              {/* Product Title & Short Description */}
              <div className="space-y-1.5 max-w-xl mx-auto lg:mx-0">
                <Link
                  href={`/products/${currentSlide.productSlug}`}
                  className="text-sm sm:text-base md:text-lg font-bold text-neutral-200 hover:text-white transition inline-flex items-center gap-2 group"
                >
                  <span>{currentSlide.productName}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-white transition" />
                </Link>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  {currentSlide.description}
                </p>
              </div>

              {/* Key Features Bullet Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-1">
                {currentSlide.perks.map((perk, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-800/80 rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-neutral-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Price & Social Rating Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                <div className="flex items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {formatPKR(currentSlide.salePrice)}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-neutral-500 line-through">
                    {formatPKR(currentSlide.regularPrice)}
                  </span>
                  <span className="bg-brand-sale/20 border border-brand-sale/40 text-brand-sale font-extrabold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full">
                    -
                    {Math.round(
                      ((currentSlide.regularPrice - currentSlide.salePrice) /
                        currentSlide.regularPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>

                <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

                <div className="flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800 px-3 py-1 rounded-full text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white text-[11px]">{currentSlide.rating}</span>
                  <span className="text-neutral-500 text-[11px]">
                    ({currentSlide.reviewsCount}+ verified)
                  </span>
                </div>
              </div>

              {/* High-Converting CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href={`/checkout?buyNow=${currentSlide.productSlug}&qty=1`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-neutral-100 px-7 sm:px-8 py-3.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Order Now (Cash on Delivery)</span>
                </Link>

                <Link
                  href={`/products/${currentSlide.productSlug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-white text-neutral-200 hover:text-white px-6 sm:px-7 py-3.5 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-200 backdrop-blur-sm active:scale-95"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 4 Interactive Category Showcase Selector Tabs (Bottom Bar) */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-neutral-800/70">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative text-left p-3.5 rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 border-neutral-700 shadow-lg ring-1 ring-neutral-600/50"
                      : "bg-neutral-950/60 border-neutral-800/60 hover:bg-neutral-900/60 hover:border-neutral-700/60 opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Progress Line when Active */}
                  {isActive && !isPaused && (
                    <motion.div
                      key={`progress-${index}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                      className="absolute top-0 left-0 h-[2px] bg-white"
                    />
                  )}
                  {isActive && isPaused && (
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white" />
                  )}

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
                      0{index + 1} • {slide.categoryName}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div
                    className={`text-xs font-bold truncate ${
                      isActive ? "text-white" : "text-neutral-300"
                    }`}
                  >
                    {slide.productName}
                  </div>
                  <div className="text-[11px] font-bold text-neutral-400 mt-1">
                    <span className={isActive ? "text-white" : "text-neutral-300"}>
                      {formatPKR(slide.salePrice)}
                    </span>{" "}
                    <span className="text-[10px] text-brand-sale font-extrabold uppercase ml-1">
                      {slide.discountBadge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
