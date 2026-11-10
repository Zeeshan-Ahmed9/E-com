import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  serializeCategories,
  serializeStoreSetting,
} from "@/lib/serialize";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { ChevronRight, ShieldCheck, Lock } from "lucide-react";

export const metadata = {
  title: "Secure Checkout — ZappMart Pakistan",
  description: "Complete your order with Cash on Delivery and free nationwide shipping across Pakistan.",
};

interface CheckoutPageProps {
  searchParams?: Promise<{ buyNow?: string; qty?: string }>;
}

export const revalidate = 0;

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const buyNowSlug = resolvedParams?.buyNow;
  const buyNowQty = parseInt(resolvedParams?.qty || "1", 10) || 1;

  let settings = null;
  let categories: any[] = [];
  let buyNowProduct = null;

  try {
    const result = await withDbRetry(async () => {
      const [s, cats, prod] = await Promise.all([
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        buyNowSlug
          ? prisma.product.findUnique({
              where: { slug: buyNowSlug },
              include: { images: { orderBy: { sortOrder: "asc" } } },
            })
          : Promise.resolve(null),
      ]);
      return { settings: s, categories: cats, buyNowProduct: prod };
    });
    settings = serializeStoreSetting(result.settings);
    categories = serializeCategories(result.categories);

    if (result.buyNowProduct) {
      const p = result.buyNowProduct;
      buyNowProduct = {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.salePrice),
        regularPrice: Number(p.regularPrice),
        imageUrl:
          p.images[0]?.url ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        quantity: buyNowQty,
      };
    }
  } catch (err: any) {
    console.error("[CheckoutPage] DB Error:", err?.message || err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* 1. Announcement Marquee */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Main Checkout Section */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumbs & Trust Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-black transition">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-900 font-semibold">Secure Checkout</span>
          </nav>

          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-2xs w-fit">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Checkout</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Checkout & Delivery Details
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Complete your information below to confirm doorstep Cash on Delivery delivery.
          </p>
        </div>

        {/* Client Interactive Checkout Form */}
        <CheckoutForm buyNowProduct={buyNowProduct} />
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Fixed Sticky Bottom Bar */}
      <MobileStickyBar />
    </div>
  );
}
