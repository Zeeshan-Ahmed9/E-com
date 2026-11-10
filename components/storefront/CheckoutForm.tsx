"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPKR } from "@/lib/utils";
import { placeOrder } from "@/app/actions/checkout";

const POPULAR_PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Mardan",
  "Sukkur",
  "Rahim Yar Khan",
  "Gujrat",
  "Wah Cantt",
  "Other City",
];

interface DirectProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  imageUrl: string;
  quantity?: number;
}

interface CheckoutFormProps {
  buyNowProduct?: DirectProduct | null;
}

export function CheckoutForm({ buyNowProduct }: CheckoutFormProps = {}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    city: "Karachi",
    customCity: "",
    postalCode: "",
    orderNotes: "",
    paymentMethod: "COD" as "COD" | "WHATSAPP",
  });

  const { items, subtotal, totalItems, clearCart, addItem } = useCartStore();

  const effectiveItems =
    items.length > 0
      ? items
      : buyNowProduct
      ? [
          {
            id: buyNowProduct.id,
            productId: buyNowProduct.id,
            name: buyNowProduct.name,
            slug: buyNowProduct.slug,
            price: buyNowProduct.price,
            regularPrice: buyNowProduct.regularPrice,
            imageUrl: buyNowProduct.imageUrl,
            quantity: buyNowProduct.quantity || 1,
          },
        ]
      : [];

  useEffect(() => {
    setMounted(true);
    // If user arrived with a direct buyNowProduct and cart is empty, sync with store
    if (buyNowProduct && items.length === 0) {
      addItem({
        productId: buyNowProduct.id,
        name: buyNowProduct.name,
        slug: buyNowProduct.slug,
        price: buyNowProduct.price,
        regularPrice: buyNowProduct.regularPrice,
        imageUrl: buyNowProduct.imageUrl,
        quantity: buyNowProduct.quantity || 1,
      });
    }
  }, [buyNowProduct, items.length, addItem]);

  const currentSubtotal =
    items.length > 0
      ? subtotal()
      : effectiveItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const itemCount =
    items.length > 0
      ? totalItems()
      : effectiveItems.reduce((acc, i) => acc + i.quantity, 0);

  const shippingFee = 0; // Free delivery
  const totalAmount = currentSubtotal + shippingFee;

  if (mounted && effectiveItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 mb-2 font-sans">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto">
          Explore our trending everyday essentials, electronics, kitchen innovations, and accessories.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-widest transition shadow-md"
        >
          <span>Explore All Products</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const destinationCity =
      formData.city === "Other City"
        ? formData.customCity?.trim() || "Pakistan"
        : formData.city;

    try {
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        shippingAddress: formData.shippingAddress,
        city: destinationCity,
        postalCode: formData.postalCode || undefined,
        orderNotes: formData.orderNotes || undefined,
        paymentMethod: formData.paymentMethod,
        items: effectiveItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          variantInfo: item.variantInfo,
        })),
      };

      const result = await placeOrder(payload);

      if (!result.success || !result.orderNumber) {
        setErrorMessage(result.error || "Failed to process order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully! Clear the client cart store
      clearCart();

      // Redirect to Order Confirmation Success page
      router.push(`/order-success/${result.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "A network error occurred while placing your order. Please retry."
      );
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrderFallback = () => {
    const itemList = effectiveItems
      .map(
        (item, i) =>
          `${i + 1}. *${item.name}* (Qty: ${item.quantity}) - ${formatPKR(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const text = `Hello ZappMart! I would like to place a Direct Order:\n\n*Name:* ${
      formData.customerName || "Customer"
    }\n*Phone:* ${formData.customerPhone || "N/A"}\n*City:* ${
      formData.city || "Karachi"
    }\n*Address:* ${formData.shippingAddress || "N/A"}\n\n*Order Items:*\n${itemList}\n\n*Total:* ${formatPKR(
      totalAmount
    )}\n*Shipping:* FREE (5-7 Days)\n*Payment:* Cash on Delivery\n\nPlease confirm availability and booking.`;

    window.open(`https://wa.me/923245003393?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* LEFT COLUMN: Customer Information & Delivery Form (7 Cols) */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Customer Contact */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-neutral-900 font-sans">
                  Contact Information
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Guest Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-brand-sale">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Usman"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp <span className="text-brand-sale">*</span>
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="0300 1234567"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Required for courier booking and WhatsApp order confirmation.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Order receipts and tracking updates will be emailed if provided.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-neutral-100">
              <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-neutral-900 font-sans">
                Delivery Address (Pakistan)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Complete Address <span className="text-brand-sale">*</span>
                </label>
                <textarea
                  name="shippingAddress"
                  required
                  rows={3}
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="House / Apartment number, Street name, Sector / Block, Landmark"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Destination City <span className="text-brand-sale">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                  >
                    {POPULAR_PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.city === "Other City" ? (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Specify City Name <span className="text-brand-sale">*</span>
                    </label>
                    <input
                      type="text"
                      name="customCity"
                      required
                      value={formData.customCity}
                      onChange={handleChange}
                      placeholder="e.g. Mirpur, Azad Kashmir"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Postal Code <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 75500"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Order Notes / Delivery Instructions{" "}
                  <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="e.g. Please call before arrival, deliver after 2 PM"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:border-black transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-neutral-100">
              <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-neutral-900 font-sans">
                Payment Method
              </h2>
            </div>

            {/* Cash on Delivery Selection Card */}
            <div className="border-2 border-black rounded-lg p-4 bg-neutral-50/50 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-950 uppercase tracking-tight">
                      Cash on Delivery (COD)
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Pay cash at doorstep when your parcel arrives
                    </p>
                  </div>
                </div>
                <span className="bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Recommended
                </span>
              </div>

              {/* 100% Cash on Delivery & Free Shipping Notice */}
              <div className="mt-4 p-3.5 bg-neutral-50 border border-neutral-200 rounded-md text-[11px] text-neutral-800 leading-relaxed">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-neutral-950 block mb-0.5">
                      100% Cash on Delivery & Free Nationwide Shipping
                    </strong>
                    No advance payment required. You only pay the full amount of{" "}
                    <strong>{formatPKR(totalAmount)}</strong> in cash to the courier rider upon delivery at your doorstep.
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-md flex items-center gap-2.5 text-xs text-rose-700 mt-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t border-neutral-100 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white py-4 rounded text-xs font-bold uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Complete Order & Confirm on Delivery — {formatPKR(totalAmount)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrderFallback}
                className="w-full bg-brand-whatsapp hover:opacity-95 text-white py-3 rounded text-xs font-bold uppercase tracking-widest transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Prefer Direct WhatsApp Booking? Click Here</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: Order Summary & Item Review (5 Cols) */}
      <div className="lg:col-span-5 sticky top-24 space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200/80 p-6 md:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-900 font-sans">
              Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h2>
            <Link
              href="/products"
              className="text-[11px] font-semibold text-neutral-500 hover:text-black transition"
            >
              Edit Bag
            </Link>
          </div>

          {/* Items List */}
          <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto no-scrollbar mb-6 pr-1">
            {effectiveItems.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover object-center"
                  />
                  <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-extrabold w-4 h-4 rounded-bl flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-neutral-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Qty: {item.quantity} × {formatPKR(item.price)}
                  </p>
                </div>

                <div className="text-xs font-bold text-neutral-900 font-sans text-right">
                  {formatPKR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900 font-sans">
                {formatPKR(currentSubtotal)}
              </span>
            </div>

            <div className="flex justify-between text-neutral-600 items-center">
              <span>Nationwide Shipping</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                FREE (5-7 Days)
              </span>
            </div>

            <div className="flex justify-between text-neutral-600 items-center">
              <span>Payment Method</span>
              <span className="font-semibold text-neutral-900 font-sans">
                Cash on Delivery (100%)
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-extrabold uppercase tracking-tight text-neutral-950 font-sans block">
                  Total Amount
                </span>
                <span className="text-[10px] text-neutral-400">
                  Including all taxes & free shipping
                </span>
              </div>
              <span className="text-xl font-extrabold text-neutral-950 font-sans">
                {formatPKR(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/60 grid grid-cols-2 gap-3 text-center text-xs">
          <div className="flex flex-col items-center justify-center p-2 bg-white rounded border border-neutral-100">
            <Truck className="w-4 h-4 text-neutral-800 mb-1" />
            <span className="font-bold text-[11px] text-neutral-900 uppercase">
              Free Delivery
            </span>
            <span className="text-[10px] text-neutral-400">5-7 Working Days</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 bg-white rounded border border-neutral-100">
            <ShieldCheck className="w-4 h-4 text-neutral-800 mb-1" />
            <span className="font-bold text-[11px] text-neutral-900 uppercase">
              7-Day Checking
            </span>
            <span className="text-[10px] text-neutral-400">Warranty on Defect</span>
          </div>
        </div>
      </div>
    </div>
  );
}
