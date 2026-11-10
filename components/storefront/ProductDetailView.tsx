"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Zap,
  MessageCircle,
  Eye,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Star,
  ChevronDown,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
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
  const [viewerCount, setViewerCount] = useState(product.viewsCount || 24);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));
  const router = useRouter();

  const regularPrice = Number(product.regularPrice);
  const salePrice = Number(product.salePrice);
  const discountPercent =
    product.badge ||
    (calcDiscountPercent(regularPrice, salePrice) > 0
      ? `-${calcDiscountPercent(regularPrice, salePrice)}%`
      : null);

  const savingsAmount = regularPrice > salePrice ? regularPrice - salePrice : 0;

  // Gentle viewer count fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setViewerCount((prev) => Math.max(18, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Show sticky bar when scrolled past buy box
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    setTimeout(() => {
      setAddedAnimation(false);
      openCart();
    }, 500);
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
    router.push(`/checkout?buyNow=${product.slug}&qty=${quantity}`);
  };

  const handleOrderWhatsApp = () => {
    const message = `Hello ZappMart! I would like to order *${product.name}* (${quantity} item${quantity > 1 ? "s" : ""}) for *${formatPKR(salePrice * quantity)}* via 100% Cash on Delivery.\n\nProduct Link: ${window.location.href}\n\nPlease confirm availability and dispatch!`;
    window.open(`https://wa.me/923245003393?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Dates for delivery timeline
  const today = new Date();
  const dispatchDate = new Date();
  dispatchDate.setDate(today.getDate() + 1);
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + 6);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-PK", { month: "short", day: "numeric" });

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="space-y-12">
      {/* 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* LEFT: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-xs">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center transition-all duration-300"
            />

            {/* Discount Badge */}
            {discountPercent && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-brand-sale text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {discountPercent}
                </span>
              </div>
            )}

            {/* Wishlist Heart Button */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: salePrice,
                  regularPrice: regularPrice,
                  imageUrl: primaryImage,
                  category: product.category?.name,
                })
              }
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
              title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted
                    ? "text-red-500 fill-red-500"
                    : "text-neutral-500 hover:text-black"
                }`}
              />
            </motion.button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, idx) => (
                <motion.button
                  key={img.id || idx}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
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
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Purchase Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Rating */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              {product.category && (
                <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">
                  {product.category.name}
                </span>
              )}
              {/* Star Rating Badge */}
              <div className="flex items-center gap-1 text-xs text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[11px] text-neutral-900">4.9</span>
                <span className="text-[10px] text-neutral-500">(128 reviews)</span>
              </div>
            </div>

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

          {/* Live Viewer Urgency & Stock Level */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200/80 px-3 py-2 rounded-xl text-neutral-700">
              <Eye className="w-4 h-4 text-neutral-900 shrink-0" />
              <span className="text-[11px]">
                <strong className="text-neutral-950 font-bold">{viewerCount} people</strong> viewing
              </span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-2 rounded-xl text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-semibold">
                In Stock • Dispatches Tomorrow
              </span>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
              Quantity
            </label>
            <div className="inline-flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black rounded hover:bg-white transition cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-neutral-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black rounded hover:bg-white transition cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-white hover:bg-neutral-50 text-black border-2 border-black py-3.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700">Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>

            {/* Buy It Now */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 fill-current text-amber-400" />
              <span>Buy It Now (Cash on Delivery)</span>
            </motion.button>

            {/* Order on WhatsApp */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOrderWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-black font-extrabold py-3.5 rounded-xl text-xs md:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order on WhatsApp (Instant)</span>
            </motion.button>
          </div>

          {/* Nationwide Delivery Stepper */}
          <div className="p-4 rounded-2xl border border-neutral-200/90 bg-neutral-50/70 space-y-3">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-800 block text-center">
              Nationwide Delivery Timeline (Free Shipping)
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
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-900 uppercase">
                  {formatDate(deliveryDate)}
                </span>
                <span className="text-[10px] text-neutral-500">Doorstep COD</span>
              </div>
            </div>
          </div>

          {/* Luxury Accordion Tabs */}
          <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
            {/* Tab 1: Description & Details */}
            <div>
              <button
                onClick={() => toggleAccordion("description")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-neutral-900 uppercase tracking-wider bg-white hover:bg-neutral-50 transition cursor-pointer"
              >
                <span>Product Overview & Features</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform ${
                    openAccordion === "description" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "description" && (
                <div className="px-4 pb-4 pt-1 text-neutral-600 leading-relaxed space-y-2 bg-white">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-700 pt-1">
                    <li>100% genuine guaranteed quality.</li>
                    <li>Thoroughly inspected before courier packaging.</li>
                    <li>Complete accessories included in original box.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tab 2: Free Shipping & COD Policy */}
            <div>
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-neutral-900 uppercase tracking-wider bg-white hover:bg-neutral-50 transition cursor-pointer"
              >
                <span>Free Shipping & 100% Cash on Delivery</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform ${
                    openAccordion === "shipping" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="px-4 pb-4 pt-1 text-neutral-600 leading-relaxed space-y-2 bg-white">
                  <p>
                    We deliver to <strong>all cities, towns, and villages across Pakistan</strong> with 100% Free Shipping on all orders.
                  </p>
                  <p>
                    <strong>No advance payment required:</strong> Pay the exact cash amount directly to the courier delivery rider at your doorstep.
                  </p>
                </div>
              )}
            </div>

            {/* Tab 3: 7-Day Checking Warranty */}
            <div>
              <button
                onClick={() => toggleAccordion("warranty")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-neutral-900 uppercase tracking-wider bg-white hover:bg-neutral-50 transition cursor-pointer"
              >
                <span>7-Day Easy Replacement Warranty</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform ${
                    openAccordion === "warranty" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "warranty" && (
                <div className="px-4 pb-4 pt-1 text-neutral-600 leading-relaxed space-y-2 bg-white">
                  <p>
                    Every purchase comes with a <strong>7-Day Checking Warranty</strong>. If an item arrives damaged or defective, WhatsApp us with a picture/video within 7 days for an instant hassle-free replacement.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="border border-neutral-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-neutral-950 text-white p-3 text-center font-bold uppercase tracking-wider text-[11px]">
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
                  <td className="p-3 font-medium text-neutral-800">Free Nationwide Shipping (All Orders)</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px]">✓</span>
                  </td>
                  <td className="p-3 text-center text-neutral-400">✕</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-neutral-800">100% Doorstep Cash on Delivery</td>
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

      {/* STICKY BOTTOM QUICK-BUY BAR (Slides up on scroll) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-3 px-4 shadow-2xl"
          >
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200 hidden sm:block">
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-brand-sale font-sans">
                      {formatPKR(salePrice)}
                    </span>
                    {regularPrice > salePrice && (
                      <span className="text-xs text-neutral-400 line-through hidden sm:inline">
                        {formatPKR(regularPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAddToCart}
                  className="bg-white hover:bg-neutral-100 text-black border border-neutral-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-2xs"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95"
                >
                  Buy Now (COD)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
