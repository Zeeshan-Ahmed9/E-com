"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Eye } from "lucide-react";
import { formatPKR, calcDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/lib/store/useCartStore";

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
  const addItem = useCartStore((state) => state.addItem);

  const regularPrice = Number(product.regularPrice);
  const salePrice = Number(product.salePrice);
  const discountPercent =
    product.badge ||
    (calcDiscountPercent(regularPrice, salePrice) > 0
      ? `-${calcDiscountPercent(regularPrice, salePrice)}%`
      : null);

  const primaryImage = product.images[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";
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
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1:1 Media Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-100">
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
              alt={`${product.name} view 2`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`absolute inset-0 object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0"
              }`}
            />
          )}
        </Link>

        {/* Top-Left Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 pointer-events-none">
            <span className="bg-brand-sale text-white text-[10px] md:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              {discountPercent}
            </span>
          </div>
        )}

        {/* Desktop Quick-Add on Hover Slide-up Button */}
        <div className="hidden md:block absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-black/90 hover:bg-black text-white text-xs font-semibold py-2.5 rounded uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Mobile Floating Circular Bag Icon (Bottom Center) */}
        <div className="md:hidden absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-900 active:scale-90 transition focus:outline-none"
            aria-label="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Block */}
      <div className="pt-3 pb-2 text-center flex flex-col flex-1">
        {product.category && (
          <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="text-xs sm:text-sm font-medium text-neutral-900 hover:text-black line-clamp-2 transition-colors mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing Block */}
        <div className="mt-auto flex items-center justify-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-brand-sale">
            {formatPKR(salePrice)}
          </span>
          {regularPrice > salePrice && (
            <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
              {formatPKR(regularPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

