"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck, Sparkles, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPKR } from "@/lib/utils";

const RECOMMENDED_UPSELLS = [
  {
    id: "cmw93krbc0005w47s7q54b8a2",
    name: "Magnetic Car Phone Mount 360",
    slug: "magnetic-car-phone-mount-360",
    price: 999,
    regularPrice: 1500,
    imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cmw93krbc0001w47sb2t8k651",
    name: "Rechargeable Handheld Frother",
    slug: "rechargeable-handheld-frother",
    price: 1350,
    regularPrice: 1800,
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
  },
];

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  const { items, isOpen, closeCart, updateQuantity, removeItem, addItem, subtotal, totalItems } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const currentSubtotal = subtotal();
  const count = totalItems();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const itemList = items
      .map((item, i) => `${i + 1}. *${item.name}* (Qty: ${item.quantity}) - ${formatPKR(item.price * item.quantity)}`)
      .join("\n");

    const message = `Hello ZappMart! I would like to place an order via WhatsApp:\n\n${itemList}\n\n*Total Amount:* ${formatPKR(currentSubtotal)}\n*Shipping:* FREE NATIONWIDE (5-7 Working Days)\n*Payment Method:* 100% Cash on Delivery\n\nPlease confirm my order.`;

    window.open(`https://wa.me/923302867560?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Top Bar */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-extrabold uppercase tracking-tight text-neutral-900 font-sans">
              Shopping Bag ({count})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>FREE Nationwide Delivery Unlocked!</span>
            </span>
            <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.2 rounded-full">
              100% FREE
            </span>
          </div>
          <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald-600 rounded-full" />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-neutral-500 text-sm font-medium">Your shopping bag is empty.</p>
              <button
                onClick={closeCart}
                className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md hover:bg-neutral-800 transition active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="72px"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-neutral-900 truncate">
                      {item.name}
                    </h3>
                    <div className="text-xs font-black text-brand-sale mt-0.5 font-sans">
                      {formatPKR(item.price)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-500 hover:text-black transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-800 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-500 hover:text-black transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Recommended Upsell Add-ons */}
              <div className="pt-5 mt-2 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Frequently Added Together</span>
                </div>
                {RECOMMENDED_UPSELLS.filter((u) => !items.some((i) => i.name === u.name)).slice(0, 1).map((upsell) => (
                  <div
                    key={upsell.id}
                    className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 flex items-center justify-between gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 border border-neutral-200">
                      <Image
                        src={upsell.imageUrl}
                        alt={upsell.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {upsell.name}
                      </div>
                      <div className="text-[11px] font-bold text-brand-sale">
                        {formatPKR(upsell.price)}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        addItem({
                          productId: upsell.id,
                          name: upsell.name,
                          slug: upsell.slug,
                          price: upsell.price,
                          regularPrice: upsell.regularPrice,
                          imageUrl: upsell.imageUrl,
                          quantity: 1,
                        })
                      }
                      className="bg-black hover:bg-neutral-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs active:scale-95 transition"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 font-bold uppercase tracking-wider text-xs">
                Subtotal
              </span>
              <span className="font-extrabold text-lg text-neutral-950 font-sans">
                {formatPKR(currentSubtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Nationwide Shipping</span>
              <span className="text-emerald-600 font-bold uppercase text-[11px]">FREE (5-7 Days)</span>
            </div>

            {/* Primary Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-md active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Direct WhatsApp Checkout Button */}
            <button
              onClick={handleWhatsAppCheckout}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebd5a] text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest transition shadow-xs active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp (Instant)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
