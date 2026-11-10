import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-12 md:py-20 lg:py-24 border-b border-neutral-900">
      {/* Subtle luxury ambient glow & grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),rgba(255,255,255,0))]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-warm/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Campaign Info (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 md:space-y-6">
            {/* Promotional Tag */}
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700/60 rounded-full px-4 py-1.5 shadow-xs">
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              <span className="text-[11px] md:text-xs font-semibold tracking-widest uppercase text-neutral-200">
                GRAND OPENING SALE • FLAT 15% OFF
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[1.05]">
              ZAPPMART <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                EVERYDAY ESSENTIALS
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover verified lifestyle products across Electronics, Kitchen Innovations, Home Living, Kids Toys, and Daily Accessories. Tested quality with 100% Cash on Delivery across Pakistan.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-neutral-200 px-8 py-3.5 rounded text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#all-collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-white text-white px-8 py-3.5 rounded text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-200"
              >
                Explore Categories
              </a>
            </div>

            {/* Key Value Micro-Badges */}
            <div className="pt-4 grid grid-cols-3 gap-2 border-t border-neutral-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-[11px] text-neutral-400 font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-[11px] text-neutral-400 font-medium">COD Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-[11px] text-neutral-400 font-medium">5-7 Days Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Visual 3D Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Podium Backdrop Card */}
              <div className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl text-center overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-brand-gold/10 rounded-full blur-2xl" />

                {/* Offer Badge Ribbon */}
                <div className="inline-block bg-brand-sale text-white font-extrabold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-md">
                  LIMITED TIME ONLY
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
                    FLAT 15% OFF
                  </h3>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
                    ON ALL MULTI-CATEGORY ORDERS
                  </p>
                </div>

                {/* 3D Product collage showcase */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-2xl mb-1">🎧</span>
                    <span className="text-xs font-semibold text-white">Electronics</span>
                    <span className="text-[10px] text-neutral-400">Headphones & Smart</span>
                  </div>
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-2xl mb-1">🍳</span>
                    <span className="text-xs font-semibold text-white">Kitchen Tools</span>
                    <span className="text-[10px] text-neutral-400">4-in-1 Choppers</span>
                  </div>
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-2xl mb-1">💡</span>
                    <span className="text-xs font-semibold text-white">Home Living</span>
                    <span className="text-[10px] text-neutral-400">Sunset RGB Lamps</span>
                  </div>
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-2xl mb-1">🏎️</span>
                    <span className="text-xs font-semibold text-white">Kids Toys</span>
                    <span className="text-[10px] text-neutral-400">4WD RC Stunt Cars</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 font-medium">
                  Advance Rs 300 required for confirmation • Rest on Doorstep
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

