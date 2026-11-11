"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Heart, Star } from "lucide-react";
import { formatPKR, calcDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    regularPrice: number | string | { toString(): string };
    salePrice: number | string | { toString(): string };
    badge?: string | null;
    stockQuantity: number;
    images: ProductImage[];
    category?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));

  const regularPrice = Number(product.regularPrice);
  const salePrice = Number(product.salePrice);
  const discountPercent =
    product.badge ||
    (calcDiscountPercent(regularPrice, salePrice) > 0
      ? `-${calcDiscountPercent(regularPrice, salePrice)}%`
      : null);

  const primaryImage =
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";
  const hoverImage = product.images[1]?.url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: salePrice,
      regularPrice: regularPrice,
      imageUrl: primaryImage,
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-[#E7EAF3] hover:border-[#D1D7E6] shadow-[0_4px_16px_rgba(11,18,32,0.04)] hover:shadow-[0_16px_32px_rgba(11,18,32,0.1)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1:1 Square Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F6F7FB]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Main Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && hoverImage !== primaryImage
                ? "opacity-0 scale-105"
                : "opacity-100 group-hover:scale-105"
            }`}
          />

          {/* Secondary Hover Image (if available) */}
          {hoverImage !== primaryImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`absolute inset-0 object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0"
              }`}
            />
          )}
        </Link>

        {/* Top-Left Discount Badge (Zuu Signature Coral Red) */}
        {discountPercent && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-[#FF4D2E] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              {discountPercent}
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: salePrice,
              regularPrice: regularPrice,
              imageUrl: primaryImage,
              category: product.category?.name,
            });
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "text-[#FF4D2E] fill-[#FF4D2E]"
                : "text-[#5B6478] hover:text-[#0B1220]"
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="hidden md:block absolute bottom-2.5 inset-x-2.5 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
              justAdded
                ? "bg-[#12B76A] text-white"
                : "bg-gradient-to-r from-[#FF4D2E] to-[#FF7A45] hover:opacity-95 text-white"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Quick Add Button (Bottom Right) */}
        <div className="md:hidden absolute bottom-2 right-2 z-10">
          <button
            onClick={handleQuickAdd}
            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer ${
              justAdded
                ? "bg-[#12B76A] text-white"
                : "bg-gradient-to-r from-[#FF4D2E] to-[#FF7A45] text-white"
            }`}
            aria-label="Quick Add"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Product Details Block */}
      <div className="p-3.5 flex flex-col flex-1">
        {product.category && (
          <span className="text-[10px] tracking-wider uppercase text-[#5B6478] font-bold mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="text-xs sm:text-sm font-bold text-[#0B1220] hover:text-[#FF4D2E] line-clamp-2 transition-colors mb-1.5 font-sans leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-[#FFB020]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#FFB020] text-[#FFB020]" />
            ))}
          </div>
          <span className="text-[10px] text-[#5B6478] font-semibold">4.9</span>
        </div>

        {/* Pricing Block */}
        <div className="mt-auto flex items-baseline gap-2 pt-1 border-t border-[#E7EAF3]/80">
          <span className="text-sm sm:text-base font-extrabold text-[#FF4D2E] font-sans">
            {formatPKR(salePrice)}
          </span>
          {regularPrice > salePrice && (
            <s className="text-xs text-[#8A92A6]">
              {formatPKR(regularPrice)}
            </s>
          )}
        </div>
      </div>
    </div>
  );
}
