"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPKR } from "@/lib/utils";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } =
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

    const message = `Hello ZappMart! I would like to place an order via WhatsApp:\n\n${itemList}\n\n*Total Amount:* ${formatPKR(currentSubtotal)}\n*Shipping:* FREE (5-7 Working Days)\n*Payment Method:* Cash on Delivery\n\nPlease confirm my order.`;

    window.open(`https://wa.me/923245003393?text=${encodeURIComponent(message)}`, "_blank");
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
            <h2 className="text-base font-bold uppercase tracking-tight text-neutral-900">
              Shopping Cart ({count})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Notice */}
        <div className="bg-neutral-100/80 px-5 py-2.5 text-center text-xs font-semibold text-neutral-800 border-b border-neutral-200/60">
          🎉 FREE Delivery Unlocked on All Orders Across Pakistan!
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-neutral-500 text-sm">Your cart is currently empty.</p>
              <button
                onClick={closeCart}
                className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow-sm hover:bg-neutral-800 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Thumbnail */}
                <div className="relative w-18 h-18 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
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
                  <h3 className="text-xs font-semibold text-neutral-900 truncate">
                    {item.name}
                  </h3>
                  <div className="text-xs font-bold text-brand-sale mt-0.5">
                    {formatPKR(item.price)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center border border-neutral-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-neutral-500 hover:text-black transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-neutral-800 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-neutral-500 hover:text-black transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 font-medium uppercase tracking-wider text-xs">
                Subtotal
              </span>
              <span className="font-extrabold text-base text-neutral-950 font-sans">
                {formatPKR(currentSubtotal)}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500">
              Taxes & free shipping calculated. Cash on Delivery available at checkout.
            </p>

            {/* Primary Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded text-xs font-bold uppercase tracking-widest transition shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Direct WhatsApp Checkout Button */}
            <button
              onClick={handleWhatsAppCheckout}
              className="flex items-center justify-center gap-2 w-full bg-brand-whatsapp hover:opacity-95 text-white py-3 rounded text-xs font-bold uppercase tracking-widest transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

