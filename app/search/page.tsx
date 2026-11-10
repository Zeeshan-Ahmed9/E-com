import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  serializeCategories,
  serializeProducts,
  serializeStoreSetting,
} from "@/lib/serialize";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Search, ChevronRight, Package, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const query = (resolved?.q || "").trim();

  let products: any[] = [];
  let categories: any[] = [];
  let settings: any = null;

  try {
    const data = await withDbRetry(async () => {
      const [rawProducts, rawCats, rawSetting] = await Promise.all([
        query
          ? prisma.product.findMany({
              where: {
                status: "ACTIVE",
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                  { category: { name: { contains: query, mode: "insensitive" } } },
                  { slug: { contains: query, mode: "insensitive" } },
                ],
              },
              include: {
                category: { select: { id: true, name: true, slug: true } },
                images: { orderBy: { sortOrder: "asc" } },
              },
            })
          : Promise.resolve([]),
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
      ]);

      return {
        products: serializeProducts(rawProducts),
        categories: serializeCategories(rawCats),
        settings: serializeStoreSetting(rawSetting),
      };
    });

    products = data.products;
    categories = data.categories;
    settings = data.settings;
  } catch (err) {
    console.error("SearchPage error:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Announcement Bar */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar */}
      <NavigationBar />

      {/* 4. Search Results Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-black transition">
            All Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold">Search Results</span>
        </nav>

        {/* Title & Search Summary */}
        <div className="border-b border-neutral-100 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Search: &ldquo;{query}&rdquo;
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Found {products.length} product{products.length === 1 ? "" : "s"} matching your search.
          </p>
        </div>

        {/* Results Grid */}
        {products.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <Search className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">No matching products found</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking the spelling or browse our full collection.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore All Products</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Sticky Bar */}
      <MobileStickyBar />
    </div>
  );
}

