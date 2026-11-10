import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  serializeProduct,
  serializeProducts,
  serializeCategories,
  serializeStoreSetting,
} from "@/lib/serialize";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { ProductDetailView } from "@/components/storefront/ProductDetailView";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 30;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return { title: "Product Not Found — ZappMart" };
  }

  return {
    title: `${product.name} — ZappMart Pakistan`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let settings: any = null;
  let categories: any[] = [];
  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    const result = await withDbRetry(async () => {
      const [s, cats, prod] = await Promise.all([
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.product.findUnique({
          where: { slug },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: { select: { name: true, slug: true } },
          },
        }),
      ]);

      if (!prod) return { settings: s, categories: cats, product: null, relatedProducts: [] };

      const related = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          categoryId: prod.categoryId,
          NOT: { id: prod.id },
        },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: { select: { name: true, slug: true } },
        },
        take: 4,
      });

      return { settings: s, categories: cats, product: prod, relatedProducts: related };
    });

    settings = serializeStoreSetting(result.settings);
    categories = serializeCategories(result.categories);
    product = serializeProduct(result.product);
    relatedProducts = serializeProducts(result.relatedProducts);
  } catch (err: any) {
    console.error("[ProductDetailPage] Database error:", err?.message || err);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Top Announcement Marquee */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Main Product Container */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-8 font-medium truncate">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/products" className="hover:text-black transition">
            All Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link
                href={`/collections/${product.category.slug}`}
                className="hover:text-black transition"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-neutral-900 font-semibold truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <ProductDetailView product={product} />

        {/* Product Long Description / Tabs */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-neutral-100 max-w-4xl">
          <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-neutral-900 mb-4">
            Product Description & Overview
          </h2>
          <div className="prose prose-sm text-neutral-600 leading-relaxed font-normal whitespace-pre-line">
            {product.description}
          </div>

          {/* Highlights Box */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Truck className="w-5 h-5 text-neutral-900 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Free Shipping</h4>
                <p className="text-[11px] text-neutral-500">Delivered in 5-7 working days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Cash on Delivery</h4>
                <p className="text-[11px] text-neutral-500">Rs. 300 advance confirmation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-neutral-900 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase">7-Day Warranty</h4>
                <p className="text-[11px] text-neutral-500">Replacement on defect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-100">
            <div className="text-center md:text-left mb-8">
              <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-1">
                DISCOVER MORE
              </span>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
                You May Also Like
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
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
