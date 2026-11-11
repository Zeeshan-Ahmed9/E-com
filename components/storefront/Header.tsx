"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { formatPKR } from "@/lib/utils";
import { SerializedProduct } from "@/lib/serialize";
import { MobileDrawer } from "./MobileDrawer";

interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  categories: CategoryNavItem[];
}

export function Header({ categories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SerializedProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const totalItems = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);
  const wishlistCount = useWishlistStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Debounced live search
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7EAF3] transition-all shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Left: Mobile Hamburger & Desktop Trust Tagline */}
          <div className="flex items-center gap-3 w-1/3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-[#0B1220] hover:text-[#FF4D2E] focus:outline-hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.75]" />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex items-center gap-2 text-[#0B1220] hover:text-[#FF4D2E] px-3.5 py-1.5 rounded-full hover:bg-[#F6F7FB] transition cursor-pointer"
              aria-label="Search store"
            >
              <Search className="w-4 h-4 stroke-[2]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#5B6478]">
                Search
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-[#5B6478] pl-2 border-l border-[#E7EAF3]">
              <span className="text-[#12B76A] font-bold">✓</span>
              <span>Cash on Delivery Across Pakistan</span>
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex items-center justify-center flex-1 text-center">
            <Link
              href="/"
              className="group flex flex-col items-center select-none"
            >
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0B1220] font-sans group-hover:text-[#FF4D2E] transition flex items-center gap-1">
                ZAPPMART<span className="w-2 h-2 rounded-full bg-[#FF4D2E] inline-block mb-1"></span>
              </span>
              <span className="text-[9px] tracking-[0.22em] uppercase text-[#5B6478] font-bold -mt-1 hidden sm:block">
                The Everything Store
              </span>
            </Link>
          </div>

          {/* Right: Wishlist & Cart Actions */}
          <div className="flex items-center justify-end gap-2 md:gap-3 w-1/3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-[#0B1220] hover:text-[#FF4D2E] cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-[#0B1220] hover:text-[#FF4D2E] hover:bg-[#F6F7FB] rounded-full transition cursor-pointer"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#0B1220] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#0B1220] hover:text-[#FF4D2E] hover:bg-[#F6F7FB] rounded-full transition focus:outline-hidden cursor-pointer"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 stroke-[1.75]" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF4D2E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200 shadow-sm">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Instant Search Modal Overlay */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 bg-white/98 backdrop-blur-xl px-4 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-neutral-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products across Electronics, Kitchen, Home, Toys..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-11 pr-12 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-black focus:bg-white transition"
                />
                {isSearching ? (
                  <Loader2 className="absolute right-4 w-4 h-4 text-neutral-400 animate-spin" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Live Suggestions Dropdown */}
              {searchQuery.trim().length >= 2 && (
                <div className="mt-3 bg-white rounded-2xl border border-neutral-100 p-2 shadow-lg divide-y divide-neutral-100">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-4 text-center text-xs text-neutral-500">
                      No matching products found for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  ) : (
                    <>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5">
                        Matching Products
                      </div>
                      {searchResults.map((p) => {
                        const img =
                          p.images[0]?.url ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30";
                        return (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition group"
                          >
                            <div className="relative w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                              <Image
                                src={img}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs text-neutral-900 truncate group-hover:text-black">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                                <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-neutral-700">
                                  {p.category?.name || "General"}
                                </span>
                                <span className="font-extrabold text-neutral-950">
                                  {formatPKR(p.salePrice)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors" />
                          </Link>
                        );
                      })}
                      <div className="pt-2 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black inline-flex items-center gap-1.5 py-1"
                        >
                          <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}
