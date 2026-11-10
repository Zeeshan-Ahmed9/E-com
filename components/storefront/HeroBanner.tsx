"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";

export function HeroBanner() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-14 md:py-20 lg:py-24 border-b border-neutral-900">
      {/* Luxury ambient glow & radial backdrop */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Campaign Info (7 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-center lg:text-left space-y-5 md:space-y-6"
          >
            {/* Promotional Tag */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-full px-4 py-1.5 shadow-sm backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] md:text-xs font-semibold tracking-widest uppercase text-neutral-200">
                  GRAND OPENING SALE • FLAT 15% OFF
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[1.05]"
            >
              ZAPPMART <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                EVERYDAY ESSENTIALS
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Discover verified lifestyle products across Electronics, Kitchen Innovations, Home
              Living, Kids Toys, and Daily Accessories. Tested quality with 100% Cash on Delivery
              across Pakistan.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-neutral-100 px-8 py-3.5 rounded text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-xl"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <a
                  href="#all-collections"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-white text-white px-8 py-3.5 rounded text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-200 backdrop-blur-xs"
                >
                  Explore Categories
                </a>
              </motion.div>
            </motion.div>

            {/* Key Value Micro-Badges */}
            <motion.div
              variants={itemVariants}
              className="pt-4 grid grid-cols-3 gap-2 border-t border-neutral-800/80 max-w-lg mx-auto lg:mx-0 text-left"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-300 shrink-0" />
                <span className="text-[11px] text-neutral-300 font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-300 shrink-0" />
                <span className="text-[11px] text-neutral-300 font-medium">COD Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-300 shrink-0" />
                <span className="text-[11px] text-neutral-300 font-medium">5-7 Days Dispatch</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual 3D Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="relative w-full max-w-md lg:max-w-none"
            >
              {/* Podium Backdrop Card */}
              <div className="relative bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl text-center overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl" />

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
                  <Link href="/collections/electronics" className="block group">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-500 rounded-xl p-3 flex flex-col items-center transition-colors cursor-pointer"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎧</span>
                      <span className="text-xs font-semibold text-white">Electronics</span>
                      <span className="text-[10px] text-neutral-400">Headphones & Smart</span>
                    </motion.div>
                  </Link>

                  <Link href="/collections/kitchen-dining" className="block group">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-500 rounded-xl p-3 flex flex-col items-center transition-colors cursor-pointer"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🍳</span>
                      <span className="text-xs font-semibold text-white">Kitchen Tools</span>
                      <span className="text-[10px] text-neutral-400">4-in-1 Choppers</span>
                    </motion.div>
                  </Link>

                  <Link href="/collections/home-products" className="block group">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-500 rounded-xl p-3 flex flex-col items-center transition-colors cursor-pointer"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">💡</span>
                      <span className="text-xs font-semibold text-white">Home Living</span>
                      <span className="text-[10px] text-neutral-400">Sunset RGB Lamps</span>
                    </motion.div>
                  </Link>

                  <Link href="/collections/toys-games" className="block group">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-500 rounded-xl p-3 flex flex-col items-center transition-colors cursor-pointer"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏎️</span>
                      <span className="text-xs font-semibold text-white">Kids Toys</span>
                      <span className="text-[10px] text-neutral-400">4WD RC Stunt Cars</span>
                    </motion.div>
                  </Link>
                </div>

                <p className="text-[11px] text-neutral-400 font-medium">
                  100% Cash on Delivery Nationwide • Free Shipping On All Products
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
