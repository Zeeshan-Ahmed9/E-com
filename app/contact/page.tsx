import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { ContactForm } from "@/components/storefront/ContactForm";
import {
  ChevronRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
} from "lucide-react";

export const metadata = {
  title: "Contact Us — ZappMart Pakistan",
  description:
    "Get in touch with ZappMart Pakistan. Reach our dedicated team via WhatsApp, phone, or email for order status, inquiries, and customer support.",
};

export const revalidate = 0;

export default async function ContactPage() {
  let settings = null;
  let categories: any[] = [];

  try {
    [settings, categories] = await withDbRetry(async () => {
      return await Promise.all([
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
        prisma.category.findMany({
          orderBy: { sortOrder: "asc" },
        }),
      ]);
    });
  } catch (err: any) {
    console.error("[ContactPage] Database error:", err?.message || err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Top Announcement Marquee */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Main Contact Page Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold">Contact Us</span>
        </nav>

        {/* Page Title */}
        <div className="text-center md:text-left mb-10 pb-6 border-b border-neutral-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl font-normal leading-relaxed">
            Have questions about an item, delivery status, or advance payment confirmation? Our customer care team is here to assist you nationwide.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Contact Details & Information (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Priority Card */}
            <div className="bg-gradient-to-br from-neutral-900 to-black text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-brand-whatsapp/20 rounded-full blur-2xl" />

              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">
                  FASTEST RESPONSE CHANNEL
                </span>
              </div>

              <h3 className="text-xl font-extrabold tracking-tight uppercase mb-2">
                WhatsApp Live Support
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                Chat directly with our support specialists for instant product pictures, video demonstrations, order status updates, and custom inquiries.
              </p>

              <a
                href="https://wa.me/923245003393?text=Hello%20ZappMart!%20I%20need%20help%20with%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full bg-brand-whatsapp text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Message on WhatsApp</span>
              </a>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Phone className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Phone & WhatsApp
                  </h4>
                  <a
                    href="tel:+923245003393"
                    className="text-xs font-semibold text-neutral-700 hover:text-black mt-0.5 block"
                  >
                    +92 324 5003393
                  </a>
                  <span className="text-[10px] text-neutral-400">Available Mon - Sat (10am - 8pm PKT)</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Mail className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Email Support
                  </h4>
                  <a
                    href="mailto:support@zappmart.pk"
                    className="text-xs font-semibold text-neutral-700 hover:text-black mt-0.5 block"
                  >
                    support@zappmart.pk
                  </a>
                  <span className="text-[10px] text-neutral-400">Responses within 24 business hours</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <MapPin className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Fulfillment Hub
                  </h4>
                  <p className="text-xs text-neutral-700 mt-0.5">
                    Central Logistics Dispatch, Karachi, Pakistan
                  </p>
                  <span className="text-[10px] text-neutral-400">Doorstep delivery across all cities</span>
                </div>
              </div>
            </div>

            {/* Advance Deposit Notice Box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700">
              <ShieldAlert className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="text-neutral-900 font-bold block mb-0.5">
                  Advance Payment Requirement
                </strong>
                To prevent false orders and ensure swift courier dispatch, an advance payment of <strong>Rs. 300</strong> is required for order confirmation. The remaining total is paid upon doorstep delivery.
              </div>
            </div>
          </div>

          {/* Right Column: Clean Modern Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
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

