"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  regularPrice: any;
  salePrice: any;
  stockQuantity: number;
  badge?: string | null;
  images: any[];
  category?: any;
}

interface AllProductsSectionProps {
  products: ProductItem[];
}

export function AllProductsSection({ products }: AllProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-14 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-100 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-14"
      >
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
          HOT PICKS
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
          All Products
        </h2>
        <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
      </motion.div>

      {/* 4-Column Grid on Desktop, 2-Column on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Button (Matching Reference) */}
      <div className="text-center mt-12 md:mt-16">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs md:text-sm font-bold uppercase tracking-widest px-10 py-4 rounded-xl transition shadow-md hover:shadow-xl cursor-pointer"
          >
            <span>View More Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
