import Link from "next/link";
import { notFound } from "next/navigation";
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
import { ChevronRight, ShieldCheck, Truck, RotateCcw, FileText } from "lucide-react";

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

const POLICIES: Record<string, { title: string; subtitle: string; icon: any; content: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we collect, protect, and use your personal delivery information.",
    icon: ShieldCheck,
    content: [
      "At ZappMart, accessible from zappmart.pk, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and how we use it.",
      "Information We Collect: When you place a guest order on ZappMart, we collect your full name, phone/WhatsApp number, destination city, and shipping address solely for dispatching your courier parcel.",
      "How We Use Your Information: We use your order details to process and fulfill your Cash on Delivery parcel via licensed courier partners (TCS, Leopard, PostEx, Trax), send delivery updates, and assist via WhatsApp support.",
      "Data Protection: We never sell, rent, or trade your personal information to third parties or marketing brokers. Your information is encrypted in transit and stored safely.",
      "Cookies: Our website uses minimal performance cookies to remember your shopping cart items and saved wishlist preferences.",
    ],
  },
  refund: {
    title: "Refund & Replacement Policy",
    subtitle: "7-Day checking warranty on all verified products.",
    icon: RotateCcw,
    content: [
      "At ZappMart, we stand behind the quality of every product we sell. All items are verified and checked before dispatch.",
      "7-Day Checking Warranty: If an item arrives broken, defective, or different from described, you are covered by our 7-day hassle-free replacement warranty.",
      "How to Claim a Replacement: Simply send a short video or picture of the issue along with your Order Number to our official WhatsApp support at +92 324 5003393 within 7 days of delivery.",
      "Replacement Process: Once verified, our team will dispatch a fresh replacement item to your doorstep or process a full refund to your JazzCash, EasyPaisa, or Bank Account.",
      "Eligibility: Products must be in original condition with box and accessories. Physical misuse or intentional damage is not covered.",
    ],
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    subtitle: "100% Free Nationwide Delivery across Pakistan.",
    icon: Truck,
    content: [
      "Free Nationwide Shipping: We are proud to offer 100% Free Shipping on all products to all cities, towns, and villages across Pakistan.",
      "Estimated Delivery Time: Orders are processed within 24 hours. Standard doorstep delivery takes 5–7 working days via our premier courier partners (TCS, Leopard, Trax, PostEx).",
      "Cash on Delivery (COD): No advance payment is needed. You pay the exact order total in cash directly to the courier rider upon delivery at your doorstep.",
      "Order Tracking: Once dispatched, a live tracking ID will be sent via SMS and WhatsApp so you can monitor your parcel journey in real-time.",
      "Damaged in Transit: If the outer parcel appears heavily damaged upon arrival, please inspect before accepting and notify our WhatsApp support immediately.",
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "General terms and rules governing use of ZappMart.",
    icon: FileText,
    content: [
      "By placing an order on ZappMart, you agree to provide accurate and complete delivery details (recipient name, active phone number, complete address, and city).",
      "Pricing: All prices listed are in Pakistani Rupees (PKR) and inclusive of free nationwide shipping.",
      "Order Confirmation: We reserve the right to verify high-value orders via WhatsApp or phone call prior to courier dispatch.",
      "Doorstep Cash on Delivery: Customers are expected to receive their parcel and tender cash upon delivery. Refusing parcels without valid cause impacts courier logistics.",
      "Customer Care: For any disputes or inquiries, contact our dedicated customer support team at +92 324 5003393.",
    ],
  },
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    notFound();
  }

  const Icon = policy.icon;

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
    console.error("PolicyPage error:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Announcement Bar */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar */}
      <NavigationBar />

      {/* 4. Policy Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-400">Policies</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold">{policy.title}</span>
        </nav>

        {/* Title Block */}
        <div className="border-b border-neutral-100 pb-8 mb-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            {policy.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
            {policy.subtitle}
          </p>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-sm text-neutral-700 leading-relaxed font-normal">
          {policy.content.map((paragraph, idx) => (
            <p key={idx} className="border-l-2 border-neutral-200 pl-4 py-0.5">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Support Help Box */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-neutral-900">Have questions about this policy?</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Our Pakistan customer care team is available 24/7 on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/923245003393"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition"
          >
            <span>WhatsApp Support</span>
          </a>
        </div>
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Sticky Bar */}
      <MobileStickyBar />
    </div>
  );
}

