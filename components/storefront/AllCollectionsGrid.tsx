"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <section id="all-collections" className="py-14 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12"
      >
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
          DEPARTMENTS
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
          All Collections
        </h2>
        <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
      </motion.div>

      {/* 2-Column Grid on Mobile, 2 or 4 Columns on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {categories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="rounded-xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300"
          >
            <Link
              href={`/collections/${category.slug}`}
              className="group block relative overflow-hidden bg-white border border-neutral-100 hover:border-neutral-200"
            >
              {/* Image Container with 1:1 Aspect Ratio */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold text-lg">
                    {category.name}
                  </div>
                )}

                {/* Subtle gradient vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Category Name & Superscript Count */}
              <div className="py-3.5 text-center bg-white group-hover:bg-neutral-50 transition-colors">
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 tracking-tight inline-flex items-center justify-center gap-1.5 uppercase font-sans">
                  <span>{category.name}</span>
                  <sup className="text-[10px] sm:text-[11px] font-extrabold text-neutral-400 font-sans">
                    {category._count?.products ?? 0}
                  </sup>
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
