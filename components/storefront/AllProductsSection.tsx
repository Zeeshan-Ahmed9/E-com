import Link from "next/link";
import { ProductCard } from "./ProductCard";

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
    <section className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
      {/* Section Header */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
          All Products
        </h2>
        <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
      </div>

      {/* 4-Column Grid on Desktop, 2-Column on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Button (Matching Reference) */}
      <div className="text-center mt-10 md:mt-14">
        <Link
          href="/products"
          className="inline-block bg-black hover:bg-neutral-800 text-white text-xs md:text-sm font-bold uppercase tracking-widest px-10 py-3.5 rounded transition shadow-md hover:shadow-lg"
        >
          View More
        </Link>
      </div>
    </section>
  );
}

