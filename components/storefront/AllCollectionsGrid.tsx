"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count?: {
    products: number;
  };
}

interface AllCollectionsGridProps {
  categories: CategoryWithCount[];
}

export function AllCollectionsGrid({ categories }: AllCollectionsGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="all-collections" className="py-12 md:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Zuu Collection Signature Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-sans">
          Popular Categories
        </h2>
        <p className="text-xs sm:text-sm text-[#5B6478] mt-1 font-normal">
          Explore top-selling collections delivered fast across Pakistan
        </p>
        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#FF4D2E] to-[#FFB020] mx-auto mt-3" />
      </div>

      {/* 4-Column Grid on Desktop, 2-Column on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categories.slice(0, 4).map((category) => {
          const fallbackImage =
            category.imageUrl ||
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop";

          return (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group relative block rounded-3xl overflow-hidden aspect-[4/5] bg-[#0B1220] shadow-[0_10px_28px_rgba(11,18,32,0.12)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(11,18,32,0.22)] transition-all duration-300 cursor-pointer"
            >
              {/* Category Image */}
              <Image
                src={fallbackImage}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/30 to-transparent pointer-events-none" />

              {/* Top Item Count Pill */}
              {category._count && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                    {category._count.products} Products
                  </span>
                </div>
              )}

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB020]">
                  Collection
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight font-sans mt-0.5 group-hover:text-[#FFB020] transition-colors">
                  {category.name}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white mt-1.5 transition">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
