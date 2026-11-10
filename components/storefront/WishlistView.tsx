"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPKR } from "@/lib/utils";

export function WishlistView() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-xs text-neutral-400">
        Loading saved items...
      </div>
    );
  }

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.id,
      name: item.name,
      slug: item.slug || "",
      price: item.price,
      regularPrice: item.regularPrice || item.price,
      imageUrl: item.imageUrl,
      quantity: 1,
    });
    removeItem(item.id);
    openCart();
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Products you have saved for later. Move to cart anytime.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <Heart className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Click the heart icon on any product to save your favorite items here for easy access later.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all"
            >
              {/* Product Thumbnail */}
              <Link href={`/products/${item.slug}`} className="relative aspect-square bg-neutral-100 overflow-hidden block">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 flex items-center justify-center shadow-sm transition cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>

              {/* Details & CTA */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {item.category && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                      {item.category}
                    </span>
                  )}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-bold text-xs md:text-sm text-neutral-900 line-clamp-1 hover:text-black transition"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-extrabold text-sm md:text-base text-neutral-950 font-sans">
                      {formatPKR(item.price)}
                    </span>
                    {item.regularPrice > item.price && (
                      <span className="text-xs text-neutral-400 line-through">
                        {formatPKR(item.regularPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full bg-black hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

