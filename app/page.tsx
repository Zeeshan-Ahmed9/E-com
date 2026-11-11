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
import { TrustBadgesSection } from "@/components/storefront/TrustBadgesSection";
import { AllCollectionsGrid } from "@/components/storefront/AllCollectionsGrid";
import { AllProductsSection } from "@/components/storefront/AllProductsSection";
import { SignatureCollection } from "@/components/storefront/SignatureCollection";
import { HowItWorksSteps } from "@/components/storefront/HowItWorksSteps";
import { BottomPromoBanner } from "@/components/storefront/BottomPromoBanner";
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
              select: { products: true },
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
          take: 8,
        }),
        prisma.product.findMany({
          where: { status: "ACTIVE", isFeatured: true },
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
    <div className="flex flex-col min-h-screen bg-[#F6F7FB]">
      {/* 1. Top Announcement Marquee Ticker */}
      <AnnouncementMarquee
        text={
          settings?.announcementText ||
          "Assalamu Alaikum! 🚚 FREE delivery all over Pakistan 🇵🇰 • 100% Cash on Delivery Available ✨ • 7-Day Easy Replacement"
        }
      />

      {/* 2. Primary Header (Logo, Search, Wishlist, Cart) */}
      <Header categories={categories} />

      {/* 3. Secondary Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Zuu Signature Hero Banner with Countdown Timer & Floating Product Stack */}
      <main className="flex-1">
        <HeroBanner />

        {/* 5. Zuu Signature 4-Card Trust Badges Row */}
        <TrustBadgesSection />

        {/* 6. Popular Categories (Zuu 4-Card Grid with 4/5 Aspect Ratio) */}
        <AllCollectionsGrid categories={categories} />

        {/* 7. Trending Products Catalog (4-Column Grid with Discount Badges & PKR Pricing) */}
        <AllProductsSection products={products} />

        {/* 8. Signature Collection (Spotlight Showcase) */}
        <SignatureCollection
          products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5)}
        />

        {/* 9. How It Works (Zuu 3-Step Simple Process: Order -> Dispatch -> Pay COD) */}
        <HowItWorksSteps />

        {/* 10. Bottom Promotional Flash Banner */}
        <BottomPromoBanner />

        {/* 11. Continuous Promotion Marquee Banner */}
        <MarqueeTicker
          text={
            settings?.outletBannerText ||
            "🎉 ZAPPMART MEGA SALE — Up to 50% Off On Trending Essentials Across Pakistan ✨"
          }
        />

        {/* 12. Real Customer Reviews & WhatsApp Social Proof */}
        <CustomerReviews />

        {/* 13. FAQ Accordion */}
        <FaqSection />

        {/* 14. Why Choose Us Trust Pillars */}
        <WhyChooseUs />
      </main>

      {/* 15. Zuu Navy Footer with Newsletter */}
      <Footer categories={categories} />

      {/* 16. Mobile Sticky Navigation Bar */}
      <MobileStickyBar />
    </div>
  );
}
