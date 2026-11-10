"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
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

  if (!products || products.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const current = products[activeIndex];

  return (
    <section className="py-16 md:py-24 bg-neutral-50/70 border-t border-neutral-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
            FEATURED
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Our Signature Collection
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        {/* 3D Spotlight Carousel Stage */}
        <div className="relative max-w-4xl mx-auto flex items-center justify-center">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 md:-left-6 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-black hover:bg-neutral-100 transition active:scale-95"
            aria-label="Previous signature product"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Card Presentation */}
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-neutral-200/80 overflow-hidden text-center transition-all duration-300">
            {/* Image */}
            <Link href={`/products/${current.slug}`} className="block relative aspect-square w-full bg-neutral-100 overflow-hidden group">
              <Image
                src={current.images[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                alt={current.name}
                fill
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition"
                >
                  <span>DISCOVER PRODUCT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 md:-right-6 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center text-black hover:bg-neutral-100 transition active:scale-95"
            aria-label="Next signature product"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeIndex === idx
                  ? "bg-black w-6"
                  : "bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

