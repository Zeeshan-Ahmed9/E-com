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
import { WishlistView } from "@/components/storefront/WishlistView";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "My Wishlist • ZappMart Pakistan",
  description: "View and manage your saved items at ZappMart.",
};

export default async function WishlistPage() {
  let categories: any[] = [];
  let settings: any = null;

  try {
    const data = await withDbRetry(async () => {
      const [cats, s] = await Promise.all([
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
      ]);
      return {
        categories: serializeCategories(cats),
        settings: serializeStoreSetting(s),
      };
    });
    categories = data.categories;
    settings = data.settings;
  } catch (err) {
    console.error("WishlistPage error:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Announcement Bar */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar */}
      <NavigationBar />

      {/* 4. Main Wishlist Container */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold">Wishlist</span>
        </nav>

        <WishlistView />
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Sticky Bar */}
      <MobileStickyBar />
    </div>
  );
}

