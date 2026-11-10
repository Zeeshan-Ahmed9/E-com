"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  regularPrice: any;
  salePrice: any;
  stockQuantity: number;
  badge?: string | null;
  images: any[];
  categoryId: string;
  category?: {
    name: string;
    slug: string;
  } | null;
  createdAt?: any;
}

interface ProductsCatalogProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  selectedCategorySlug?: string;
}

export function ProductsCatalog({
  initialProducts,
  categories,
  selectedCategorySlug = "all",
}: ProductsCatalogProps) {
  const [selectedCat, setSelectedCat] = useState<string>(selectedCategorySlug);
  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Category
    if (selectedCat !== "all") {
      result = result.filter(
        (p) => p.category?.slug === selectedCat || p.categoryId === selectedCat
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.salePrice) - Number(b.salePrice));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.salePrice) - Number(a.salePrice));
        break;
      case "discount":
        result.sort((a, b) => {
          const discountA = Number(a.regularPrice) - Number(a.salePrice);
          const discountB = Number(b.regularPrice) - Number(b.salePrice);
          return discountB - discountA;
        });
        break;
      default:
        // Featured / Newest
        break;
    }

    return result;
  }, [initialProducts, selectedCat, sortBy]);

  return (
    <div className="space-y-8">
      {/* Filters & Sorting Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        {/* Category Pills (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCat("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCat === "all"
                ? "bg-black text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All Products ({initialProducts.length})
          </motion.button>

          {categories.map((cat) => {
            const count =
              cat._count?.products ??
              initialProducts.filter((p) => p.category?.slug === cat.slug).length;
            const isSelected = selectedCat === cat.slug;

            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-black text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {cat.name} ({count})
              </motion.button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 py-1.5 px-3 focus:outline-none focus:border-black cursor-pointer shadow-2xs"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">No products found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We couldn&apos;t find any items matching your current category filter. Try selecting &ldquo;All Products&rdquo;.
          </p>
          <button
            onClick={() => setSelectedCat("all")}
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow-sm hover:bg-neutral-800 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
