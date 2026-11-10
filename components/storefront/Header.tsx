"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
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
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Left: Mobile Hamburger & Desktop Search Icon */}
          <div className="flex items-center gap-3 w-1/4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-neutral-800 hover:text-black focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.75]" />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex items-center gap-2 text-neutral-800 hover:text-black p-2 rounded-full hover:bg-neutral-50 transition"
              aria-label="Search store"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
              <span className="text-xs uppercase font-medium tracking-wider text-neutral-500">
                Search
              </span>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex items-center justify-center flex-1 text-center">
            <Link
              href="/"
              className="group flex flex-col items-center select-none"
            >
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-950 font-sans group-hover:opacity-90 transition">
                ZAPPMART
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-medium -mt-1 hidden sm:block">
                The Everything Store
              </span>
            </Link>
          </div>

          {/* Right: Wishlist & Cart Actions */}
          <div className="flex items-center justify-end gap-2 md:gap-4 w-1/4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-neutral-800 hover:text-black"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden sm:flex p-2 text-neutral-800 hover:text-black hover:bg-neutral-50 rounded-full transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-neutral-800 hover:text-black hover:bg-neutral-50 rounded-full transition focus:outline-none"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 stroke-[1.75]" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-brand-sale text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Overlay / Bar */}
        {isSearchOpen && (
          <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products across Electronics, Kitchen, Home, Toys..."
                  autoFocus
                  className="w-full bg-white border border-neutral-200 rounded-full pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
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

