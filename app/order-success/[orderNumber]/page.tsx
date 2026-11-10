import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { AnnouncementMarquee } from "@/components/storefront/AnnouncementMarquee";
import { Header } from "@/components/storefront/Header";
import { NavigationBar } from "@/components/storefront/NavigationBar";
import { Footer } from "@/components/storefront/Footer";
import { MobileStickyBar } from "@/components/storefront/MobileStickyBar";
import { formatPKR } from "@/lib/utils";
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";

interface OrderSuccessProps {
  params: Promise<{ orderNumber: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;
  return {
    title: `Order #${orderNumber} Confirmed — ZappMart Pakistan`,
    description: `Thank you for your order with ZappMart Pakistan. Order #${orderNumber} has been received.`,
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;

  let order: any = null;
  let settings: any = null;
  let categories: any[] = [];

  try {
    const result = await withDbRetry(async () => {
      const [ord, s, cats] = await Promise.all([
        prisma.order.findUnique({
          where: { orderNumber },
          include: { items: true },
        }),
        prisma.storeSetting.findUnique({ where: { id: "default" } }),
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);
      return { order: ord, settings: s, categories: cats };
    });

    order = result.order;
    settings = result.settings;
    categories = result.categories;
  } catch (err: any) {
    console.error("[OrderSuccessPage] DB query error:", err?.message || err);
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa]">
        <AnnouncementMarquee text={settings?.announcementText} />
        <Header categories={categories} />
        <NavigationBar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 mb-2 font-sans">
            Order Not Found
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6">
            We couldn&apos;t locate an order with the number <span className="font-mono font-bold text-neutral-900">#{orderNumber}</span>. Please verify your order number or contact support.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition shadow-sm"
          >
            <span>Return to Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer categories={categories} />
        <MobileStickyBar />
      </div>
    );
  }

  const totalAmount = Number(order.totalAmount);
  const subtotal = Number(order.subtotal);
  const advanceAmount = Math.min(300, totalAmount);
  const remainingOnDelivery = Math.max(0, totalAmount - advanceAmount);

  // WhatsApp quick confirmation link
  const waConfirmationText = `Hello ZappMart! I have placed an order.\n\n*Order Number:* #${order.orderNumber}\n*Customer:* ${order.customerName}\n*City:* ${order.city}\n*Total Amount:* ${formatPKR(totalAmount)}\n*Advance Token:* Rs. 300\n*Doorstep Cash:* ${formatPKR(remainingOnDelivery)}\n\nPlease provide payment details for Rs. 300 to confirm courier dispatch.`;
  const waUrl = `https://wa.me/923245003393?text=${encodeURIComponent(waConfirmationText)}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* 1. Announcement Marquee */}
      <AnnouncementMarquee text={settings?.announcementText} />

      {/* 2. Header */}
      <Header categories={categories} />

      {/* 3. Navigation Bar (Home | All Products | Contact Us) */}
      <NavigationBar />

      {/* 4. Main Success Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full">
        {/* Success Card Header */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-10 shadow-xs text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-600 block mb-1">
            ORDER RECEIVED SUCCESSFULLY
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto">
            Your Cash on Delivery order has been registered. Order reference:{" "}
            <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-sm">
              #{order.orderNumber}
            </span>
          </p>

          {/* Advance Payment Action Banner */}
          <div className="mt-8 p-5 bg-amber-50/90 border border-amber-200/80 rounded-xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-tight">
                    Next Step: Rs. 300 Advance Token Confirmation
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed max-w-xl">
                  To confirm courier booking and dispatch your parcel, an advance token of{" "}
                  <strong>Rs. 300</strong> is required via JazzCash / EasyPaisa / Bank. Our team will
                  message you on <strong>{order.customerPhone}</strong>, or you can confirm instantly below:
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-whatsapp hover:opacity-95 text-white px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Confirm on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT: Items List & Delivery Info (7 Cols) */}
          <div className="md:col-span-7 space-y-6">
            {/* Items Breakdown */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
                Ordered Items ({order.items.length})
              </h3>

              <div className="divide-y divide-neutral-100">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-3.5 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                      <Image
                        src={
                          item.imageUrl ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
                        }
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Quantity: {item.quantity} × {formatPKR(Number(item.price))}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-neutral-950 font-sans">
                      {formatPKR(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
                Delivery Details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Recipient Name</span>
                  <span className="font-semibold text-neutral-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Phone / WhatsApp</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {order.customerPhone}
                  </span>
                </div>
                {order.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Email Address</span>
                    <span className="text-neutral-900">{order.customerEmail}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination City</span>
                  <span className="font-semibold text-neutral-900">{order.city}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Complete Address</span>
                  <p className="bg-neutral-50 p-3 rounded text-neutral-800 leading-relaxed font-normal border border-neutral-100">
                    {order.shippingAddress}
                  </p>
                </div>
                {order.orderNotes && (
                  <div>
                    <span className="text-neutral-500 block mb-1">Delivery Notes</span>
                    <p className="text-neutral-600 italic bg-neutral-50 p-2.5 rounded text-[11px]">
                      &ldquo;{order.orderNotes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Financial Summary & Timeline (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Price Breakdown */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
                Payment Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 font-sans">
                    {formatPKR(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600 items-center">
                  <span>Shipping Nationwide</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Advance Token Confirmation</span>
                  <span className="font-semibold text-amber-700 font-sans">
                    Rs. 300
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Cash Payable on Delivery</span>
                  <span className="font-semibold text-neutral-900 font-sans">
                    {formatPKR(remainingOnDelivery)}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-xs font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
                    Total Order Value
                  </span>
                  <span className="text-lg font-extrabold text-neutral-950 font-sans">
                    {formatPKR(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery Timeline */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                Estimated Delivery Schedule
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Order Placed</h5>
                    <p className="text-[11px] text-neutral-500">Registered in our system</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Rs. 300 Token Verification</h5>
                    <p className="text-[11px] text-neutral-500">Via WhatsApp within 15-30 mins</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Courier Dispatch</h5>
                    <p className="text-[11px] text-neutral-500">Tracking ID provided via SMS/WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Doorstep Delivery</h5>
                    <p className="text-[11px] text-neutral-500">
                      Estimated in 5–7 working days across Pakistan
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full bg-black hover:bg-neutral-800 text-white py-3 rounded text-xs font-bold uppercase tracking-widest transition shadow-xs"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <Footer categories={categories} />

      {/* 6. Mobile Fixed Sticky Bottom Bar */}
      <MobileStickyBar />
    </div>
  );
}

