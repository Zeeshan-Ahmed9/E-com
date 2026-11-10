import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { ProductsCatalog } from "@/components/storefront/ProductsCatalog";
import { ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Category Not Found — ZappMart" };
  }

  return {
    title: `${category.name} — ZappMart Pakistan`,
    description: category.description || `Browse verified ${category.name} at ZappMart with Cash on Delivery.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let settings: any = null;
  let categories: any[] = [];
  let category: any = null;
  let products: any[] = [];

  try {
    const result = await withDbRetry(async () => {
      const [s, cats, cat] = await Promise.all([
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
        prisma.category.findMany({
          include: {
            _count: {
              select: { products: { where: { status: "ACTIVE" } } },
            },
          },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.category.findUnique({ where: { slug } }),
      ]);

      if (!cat) return { settings: s, categories: cats, category: null, products: [] };

      const prods = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          categoryId: cat.id,
        },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return { settings: s, categories: cats, category: cat, products: prods };
    });

    settings = result.settings;
    categories = result.categories;
    category = result.category;
    products = result.products;
  } catch (err: any) {
    console.error("[CategoryPage] Database error:", err?.message || err);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Top Announcement Marquee */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar */}
      <NavigationBar />

      {/* 4. Main Category Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-black transition">
            Collections
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold">{category.name}</span>
        </nav>

        {/* Page Title */}
        <div className="text-center md:text-left mb-8 md:mb-10 pb-6 border-b border-neutral-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl font-normal leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Catalog */}
        <ProductsCatalog
          initialProducts={products}
          categories={categories}
          selectedCategorySlug={category.slug}
        />
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Sticky Bar */}
      <MobileStickyBar />
    </div>
  );
}
