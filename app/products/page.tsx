import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { ProductsCatalog } from "@/components/storefront/ProductsCatalog";
import { ChevronRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const metadata = {
  title: "All Products — ZappMart Pakistan",
  description: "Browse all verified electronics, kitchen tools, home living, toys, and daily accessories with nationwide Cash on Delivery.",
};

export const revalidate = 0;

export default async function AllProductsPage() {
  let settings = null;
  let categories: any[] = [];
  let products: any[] = [];

  try {
    [settings, categories, products] = await withDbRetry(async () => {
      return await Promise.all([
        prisma.storeSetting.findUnique({
          where: { id: "default" },
        }),
        prisma.category.findMany({
          include: {
            _count: {
              select: {
                products: {
                  where: { status: "ACTIVE" },
                },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.product.findMany({
          where: { status: "ACTIVE" },
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
            },
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);
    });
  } catch (err: any) {
    console.error("[AllProductsPage] Database query error:", err?.message || err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Top Announcement Marquee */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Main Catalog Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold">All Products</span>
        </nav>

        {/* Page Title */}
        <div className="text-center md:text-left mb-8 md:mb-10 pb-6 border-b border-neutral-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl font-normal leading-relaxed">
            Discover verified multi-category essentials across Electronics, Kitchen Innovations, Home Living, Toys & Games, and Daily Accessories.
          </p>
        </div>

        {/* Interactive Products Catalog */}
        <ProductsCatalog
          initialProducts={products}
          categories={categories}
          selectedCategorySlug="all"
        />

        {/* Trust Badges Strip */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-lg bg-neutral-50">
            <Truck className="w-6 h-6 text-neutral-900 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Free Delivery Nationwide
            </h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Dispatched within 24h • Delivered in 5-7 working days
            </p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-lg bg-neutral-50">
            <ShieldCheck className="w-6 h-6 text-neutral-900 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Cash on Delivery (COD)
            </h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Rs. 300 advance confirmation • Rest at doorstep
            </p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-lg bg-neutral-50">
            <RefreshCw className="w-6 h-6 text-neutral-900 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              7-Day Checking Warranty
            </h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Hassle-free replacement for transit damage or defect
            </p>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Sticky Bar */}
      <MobileStickyBar />
    </div>
  );
}

