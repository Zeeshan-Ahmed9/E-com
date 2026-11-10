import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
    <section className="py-14 md:py-24 bg-white border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: 4-Image Grid Collage (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {collageImages.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 group shadow-xs"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Right: Editorial Story & Value Prop (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-block bg-black text-white text-[10px] md:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
              CURATED GENERAL STORE
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans leading-[1.1]">
              Smart Living For Every Modern Home
            </h2>

            <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              At <strong>ZappMart</strong>, we believe everyday essentials should combine functional innovation with honest affordability. Every product is carefully vetted for real-world durability, straightforward usability, and verified customer satisfaction.
            </p>

            <ul className="space-y-2 text-xs md:text-sm text-neutral-700 font-medium max-w-md mx-auto lg:mx-0">
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                Hand-tested product quality across all departments
              </li>
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                Transparent Cash on Delivery with doorstep delivery
              </li>
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                Direct 1-on-1 customer assistance via WhatsApp
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded text-xs md:text-sm font-bold uppercase tracking-widest transition shadow-md hover:shadow-lg"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

