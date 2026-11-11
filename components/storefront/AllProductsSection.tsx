"use client";

import Link from "next/link";
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
    <section className="py-12 md:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E7EAF3] overflow-hidden">
      {/* Zuu Collection Signature Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-sans">
          Trending Products
        </h2>
        <p className="text-xs sm:text-sm text-[#5B6478] mt-1 font-normal">
          Handpicked winning essentials with 100% Cash on Delivery
        </p>
        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#FF4D2E] to-[#FFB020] mx-auto mt-3" />
      </div>

      {/* 4-Column Grid on Desktop, 2-Column on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-10 sm:mt-12 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FF4D2E] to-[#FF7A45] shadow-[0_10px_28px_rgba(255,77,46,0.35)] hover:shadow-[0_14px_34px_rgba(255,77,46,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Explore All Items</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
