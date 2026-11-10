"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Home, Grid, ShoppingBag, Search } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

interface MobileStickyBarProps {
  onSearchClick?: () => void;
  onCategoriesClick?: () => void;
}

export function MobileStickyBar({ onSearchClick, onCategoriesClick }: MobileStickyBarProps) {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategories = () => {
    if (onCategoriesClick) {
      onCategoriesClick();
      return;
    }
    const target = document.getElementById("all-collections");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#all-collections";
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black text-white border-t border-neutral-900 shadow-lg px-6 py-2.5 flex items-center justify-between select-none">
      {/* Home */}
      <Link
        href="/"
        className="flex flex-col items-center gap-0.5 text-neutral-300 hover:text-white"
        aria-label="Home"
      >
        <Home className="w-5 h-5 stroke-[1.75]" />
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </Link>

      {/* Categories */}
      <button
        onClick={handleCategories}
        className="flex flex-col items-center gap-0.5 text-neutral-300 hover:text-white focus:outline-none"
        aria-label="All Categories"
      >
        <Grid className="w-5 h-5 stroke-[1.75]" />
        <span className="text-[10px] font-medium tracking-tight">Categories</span>
      </button>

      {/* Cart */}
      <button
        onClick={openCart}
        className="flex flex-col items-center gap-0.5 text-neutral-300 hover:text-white relative focus:outline-none"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-brand-sale text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight">Cart</span>
      </button>

      {/* Search */}
      <button
        onClick={() => {
          if (onSearchClick) onSearchClick();
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex flex-col items-center gap-0.5 text-neutral-300 hover:text-white focus:outline-none"
        aria-label="Search"
      >
        <Search className="w-5 h-5 stroke-[1.75]" />
        <span className="text-[10px] font-medium tracking-tight">Search</span>
      </button>
    </div>
  );
}

