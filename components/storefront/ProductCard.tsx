"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Heart } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col bg-white rounded-xl border border-neutral-100 hover:border-neutral-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1:1 Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100/90">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Main Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && hoverImage !== primaryImage
                ? "opacity-0 scale-108"
                : "opacity-100 group-hover:scale-108"
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
                isHovered ? "opacity-100 scale-108" : "opacity-0"
              }`}
            />
          )}
        </Link>

        {/* Top-Left Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 pointer-events-none">
            <span className="bg-brand-sale text-white text-[10px] md:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
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
          className="absolute top-2.5 right-2.5 md:top-3 md:right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-neutral-500 hover:text-black"
            }`}
          />
        </motion.button>

        {/* Desktop Quick-Add on Hover Slide-up Button */}
        <div className="hidden md:block absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleQuickAdd}
            className={`w-full py-2.5 rounded uppercase tracking-wider text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-black/90 hover:bg-black text-white backdrop-blur-xs"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Mobile Floating Circular Bag Icon (Bottom Center) */}
        <div className="md:hidden absolute bottom-2.5 right-2.5 z-10">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleQuickAdd}
            className={`w-8 h-8 rounded-full shadow-md border flex items-center justify-center transition-colors focus:outline-none ${
              justAdded
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-neutral-900 border-neutral-200"
            }`}
            aria-label="Quick Add to Cart"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      {/* Product Details Block */}
      <div className="p-3.5 text-center flex flex-col flex-1">
        {product.category && (
          <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-semibold mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-neutral-600 line-clamp-2 transition-colors mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing Block */}
        <div className="mt-auto flex items-center justify-center gap-2 pt-1">
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
    </motion.div>
  );
}
