import { prisma, withDbRetry } from "@/lib/prisma";
import {
  serializeCategories,
  serializeProducts,
  serializeStoreSetting,
} from "@/lib/serialize";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { FlashSaleCountdown } from "@/components/storefront/FlashSaleCountdown";
import { AllCollectionsGrid } from "@/components/storefront/AllCollectionsGrid";
import { AllProductsSection } from "@/components/storefront/AllProductsSection";
import { SignatureCollection } from "@/components/storefront/SignatureCollection";
import { EditorialBanner } from "@/components/storefront/EditorialBanner";
import { MarqueeTicker } from "@/components/storefront/MarqueeTicker";
import { CustomerReviews } from "@/components/storefront/CustomerReviews";
import { FaqSection } from "@/components/storefront/FaqSection";
import { WhyChooseUs } from "@/components/storefront/WhyChooseUs";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";

export const revalidate = 30; // High-performance 30s background revalidation cache

export default async function HomePage() {
  let settings = null;
  let categories: any[] = [];
  let products: any[] = [];
  let featuredProducts: any[] = [];

  try {
    // Resilient serverless query execution with automatic retry
    const [rawSettings, rawCategories, rawProducts, rawFeatured] = await withDbRetry(async () => {
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
          take: 12,
        }),
        prisma.product.findMany({
          where: {
            status: "ACTIVE",
            isFeatured: true,
          },
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
          take: 6,
        }),
      ]);
    });

    settings = serializeStoreSetting(rawSettings);
    categories = serializeCategories(rawCategories);
    products = serializeProducts(rawProducts);
    featuredProducts = serializeProducts(rawFeatured);
  } catch (err: any) {
    console.error("[HomePage] Error fetching from database:", err?.message || err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Top Announcement Marquee Ticker */}
      <AnnouncementMarquee
        text={
          settings?.announcementText ||
          "FREE DELIVERY ACROSS PAKISTAN (5-7 WORKING DAYS) • 100% CASH ON DELIVERY AVAILABLE • FLAT 15% OFF ORDERS"
        }
      />

      {/* 2. Primary Header (Logo, Search, Wishlist, Cart) */}
      <Header categories={categories} />

      {/* 3. Secondary Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Hero Promotional Banner */}
      <main className="flex-1">
        <HeroBanner />

        {/* 4.5. Live Flash Sale Countdown Bar */}
        <FlashSaleCountdown />

        {/* 5. All Collections (2x2 Grid with Superscript Counts) */}
        <AllCollectionsGrid categories={categories} />

        {/* 6. All Products (4-Column Grid with Discount Badges & PKR Pricing) */}
        <AllProductsSection products={products} />

        {/* 7. Signature Collection (3D Spotlight Coverflow Carousel) */}
        <SignatureCollection
          products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5)}
        />

        {/* 8. Editorial Brand Feature Story & Moodboard */}
        <EditorialBanner />

        {/* 9. Continuous Promotion Marquee Banner */}
        <MarqueeTicker
          text={
            settings?.outletBannerText ||
            "🎉 ZAPPMART OUTLET COMING SOON — Get Ready for Amazing Deals & Exclusive Collections ✨"
          }
        />

        {/* 10. Real Customer Reviews & WhatsApp Social Proof */}
        <CustomerReviews />

        {/* 11. FAQ Accordion (Black Luxury Theme) */}
        <FaqSection />

        {/* 12. Why Choose Us Trust Pillars */}
        <WhyChooseUs />
      </main>

      {/* 13. 3-Column Dark Footer with Newsletter */}
      <Footer categories={categories} />

      {/* 14. Mobile Sticky Navigation Bar (Fixed Bottom App Bar) */}
      <MobileStickyBar />
    </div>
  );
}
