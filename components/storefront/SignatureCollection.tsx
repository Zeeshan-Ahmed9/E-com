"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  regularPrice: any;
  salePrice: any;
  images: { url: string }[];
  category?: { name: string } | null;
}

interface SignatureCollectionProps {
  products: FeaturedProduct[];
}

export function SignatureCollection({ products }: SignatureCollectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!products || products.length === 0) return null;

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const current = products[activeIndex];

  const variants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-50/80 border-t border-neutral-200/60 overflow-hidden relative">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-neutral-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
            <span>CURATED SPOTLIGHT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Our Signature Collection
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </motion.div>

        {/* 3D Spotlight Carousel Stage */}
        <div className="relative max-w-4xl mx-auto flex items-center justify-center">
          {/* Left Arrow Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePrev}
            className="absolute left-1 sm:left-2 md:-left-6 z-20 w-11 h-11 rounded-full bg-white shadow-xl border border-neutral-200 flex items-center justify-center text-black hover:bg-neutral-50 transition cursor-pointer"
            aria-label="Previous signature product"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Animated Card Presentation */}
          <div className="w-full max-w-md min-h-[520px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id || activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full bg-white rounded-2xl shadow-xl border border-neutral-200/80 overflow-hidden text-center"
              >
                {/* Image */}
                <Link
                  href={`/products/${current.slug}`}
                  className="block relative aspect-square w-full bg-neutral-100 overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={
                      current.images[0]?.url ||
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={current.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 450px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3.5 right-3.5 bg-black/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {current.category?.name || "Featured"}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-6 md:p-8 space-y-3">
                  <Link href={`/products/${current.slug}`} className="block">
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight hover:text-neutral-600 transition">
                      {current.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-center gap-3">
                    <span className="text-base md:text-lg font-bold text-brand-sale">
                      {formatPKR(current.salePrice)}
                    </span>
                    {Number(current.regularPrice) > Number(current.salePrice) && (
                      <span className="text-sm text-neutral-400 line-through">
                        {formatPKR(current.regularPrice)}
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/products/${current.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition"
                    >
                      <span>DISCOVER PRODUCT</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleNext}
            className="absolute right-1 sm:right-2 md:-right-6 z-20 w-11 h-11 rounded-full bg-white shadow-xl border border-neutral-200 flex items-center justify-center text-black hover:bg-neutral-50 transition cursor-pointer"
            aria-label="Next signature product"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "bg-black w-7"
                  : "bg-neutral-300 hover:bg-neutral-400 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
