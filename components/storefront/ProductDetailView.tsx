"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Zap,
  MessageCircle,
  Eye,
  Plus,
  Minus,
  Check,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPKR, calcDiscountPercent } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    regularPrice: any;
    salePrice: any;
    stockQuantity: number;
    badge?: string | null;
    viewsCount?: number;
    images: ProductImage[];
    category?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [viewerCount, setViewerCount] = useState(product.viewsCount || 23);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const regularPrice = Number(product.regularPrice);
  const salePrice = Number(product.salePrice);
  const discountPercent =
    product.badge ||
    (calcDiscountPercent(regularPrice, salePrice) > 0
      ? `-${calcDiscountPercent(regularPrice, salePrice)}%`
      : null);

  const savingsAmount = regularPrice > salePrice ? regularPrice - salePrice : 0;

  // Gentle live viewer flicker for authentic urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setViewerCount((prev) => Math.max(16, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const primaryImage =
    product.images[selectedImageIndex]?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: salePrice,
      regularPrice: regularPrice,
      imageUrl: primaryImage,
      quantity,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: salePrice,
      regularPrice: regularPrice,
      imageUrl: primaryImage,
      quantity,
    });
    openCart();
  };

  const handleOrderWhatsApp = () => {
    const text = `Hello ZappMart! I would like to order this product:\n\n*Product:* ${product.name}\n*Price:* ${formatPKR(salePrice)}\n*Quantity:* ${quantity}\n*Total:* ${formatPKR(salePrice * quantity)}\n*Shipping:* FREE (5-7 Days)\n*Payment:* Cash on Delivery\n\nPlease confirm availability and booking.`;
    window.open(`https://wa.me/923245003393?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Dynamic Date Stepper
  const today = new Date();
  const dispatchDate = new Date(today);
  dispatchDate.setDate(today.getDate() + 1);
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 6);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      {/* LEFT: 1:1 Image Gallery (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main 1:1 Showcase */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-cover object-center transition-all duration-300"
          />

          {discountPercent && (
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="bg-brand-sale text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {discountPercent}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails Row */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {product.images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedImageIndex === idx
                    ? "border-black shadow-md scale-95"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${product.name} thumb ${idx + 1}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Product Details & Purchase Box (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Category & Title */}
        <div>
          {product.category && (
            <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1.5">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-snug">
            {product.name}
          </h1>
        </div>

        {/* Pricing Block */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl font-black text-brand-sale font-sans">
            {formatPKR(salePrice)}
          </span>
          {regularPrice > salePrice && (
            <span className="text-base sm:text-lg text-neutral-400 line-through">
              {formatPKR(regularPrice)}
            </span>
          )}
          {savingsAmount > 0 && (
            <span className="bg-brand-sale/10 text-brand-sale border border-brand-sale/20 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Save {formatPKR(savingsAmount)}
            </span>
          )}
        </div>

        {/* Live Social Proof / Viewer Urgency */}
        <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-200/80 px-3.5 py-2 rounded-lg text-xs text-neutral-700">
          <Eye className="w-4 h-4 text-neutral-900 shrink-0" />
          <span>
            <strong className="text-neutral-950 font-bold">{viewerCount} people</strong> are viewing this right now
          </span>
        </div>

        {/* Quantity Stepper */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
            Quantity
          </label>
          <div className="inline-flex items-center border border-neutral-200 rounded-lg bg-neutral-50 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black rounded hover:bg-white transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-neutral-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black rounded hover:bg-white transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tri-CTA Button Stack */}
        <div className="space-y-3 pt-2">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-white hover:bg-neutral-50 text-black border-2 border-black py-3.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy It Now */}
          <button
            onClick={handleBuyNow}
            className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99]"
          >
            <Zap className="w-4 h-4 fill-current text-brand-gold" />
            <span>Buy It Now (Cash on Delivery)</span>
          </button>

          {/* Order on WhatsApp */}
          <button
            onClick={handleOrderWhatsApp}
            className="w-full bg-brand-whatsapp hover:opacity-95 text-white py-3.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Order on WhatsApp (Instant)</span>
          </button>
        </div>

        {/* 3-Day Delivery Process Stepper */}
        <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/70 space-y-3">
          <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-800 block text-center">
            Nationwide Delivery Timeline
          </span>

          <div className="grid grid-cols-3 gap-2 text-center relative">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-neutral-900 uppercase">
                {formatDate(today)}
              </span>
              <span className="text-[10px] text-neutral-500">Order Placed</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-neutral-900 uppercase">
                {formatDate(dispatchDate)}
              </span>
              <span className="text-[10px] text-neutral-500">Courier Dispatch</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-brand-sale text-white flex items-center justify-center text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-neutral-900 uppercase">
                {formatDate(deliveryDate)}
              </span>
              <span className="text-[10px] text-neutral-500">Doorstep Delivery</span>
            </div>
          </div>
        </div>

        {/* ZappMart vs Others Comparison Matrix (from reference site) */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-neutral-900 text-white p-3 text-center font-bold uppercase tracking-wider text-[11px]">
            Why People Choose ZappMart Pakistan
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-600">
                <th className="p-3">Feature</th>
                <th className="p-3 text-center font-bold text-black">ZappMart</th>
                <th className="p-3 text-center text-neutral-400">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[11px]">
              <tr>
                <td className="p-3 font-medium text-neutral-800">100% Verified Quality Checked</td>
                <td className="p-3 text-center text-emerald-600 font-bold">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px]">✓</span>
                </td>
                <td className="p-3 text-center text-neutral-400">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-neutral-800">Free Fast Shipping Nationwide</td>
                <td className="p-3 text-center text-emerald-600 font-bold">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px]">✓</span>
                </td>
                <td className="p-3 text-center text-neutral-400">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-neutral-800">Doorstep Cash on Delivery</td>
                <td className="p-3 text-center text-emerald-600 font-bold">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px]">✓</span>
                </td>
                <td className="p-3 text-center text-neutral-400">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-neutral-800">7-Day Checking Warranty</td>
                <td className="p-3 text-center text-emerald-600 font-bold">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px]">✓</span>
                </td>
                <td className="p-3 text-center text-neutral-400">✕</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
