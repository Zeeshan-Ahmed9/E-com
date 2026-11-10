"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function EditorialBanner() {
  const collageImages = [
    {
      src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
      alt: "Audio Electronics",
    },
    {
      src: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=600&auto=format&fit=crop",
      alt: "Kitchen Tools",
    },
    {
      src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
      alt: "Ambient Home",
    },
    {
      src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      alt: "Daily Accessories",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-neutral-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: 4-Image Grid Collage (6 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4"
          >
            {collageImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 shadow-2xs hover:shadow-xl transition-shadow"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Editorial Story & Value Prop (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 bg-black text-white text-[10px] md:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>CURATED GENERAL STORE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans leading-[1.1]">
              Smart Living For Every Modern Home
            </h2>

            <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              At <strong>ZappMart</strong>, we believe everyday essentials should combine functional
              innovation with honest affordability. Every product is carefully vetted for real-world
              durability, straightforward usability, and verified customer satisfaction.
            </p>

            <ul className="space-y-2 text-xs md:text-sm text-neutral-700 font-medium max-w-md mx-auto lg:mx-0">
              <li className="flex items-center gap-2.5 justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                Hand-tested product quality across all departments
              </li>
              <li className="flex items-center gap-2.5 justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                Transparent Cash on Delivery with doorstep delivery
              </li>
              <li className="flex items-center gap-2.5 justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                Direct 1-on-1 customer assistance via WhatsApp
              </li>
            </ul>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded text-xs md:text-sm font-bold uppercase tracking-widest transition shadow-md hover:shadow-xl"
                >
                  <span>Explore The Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
