"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
}

interface FooterProps {
  categories?: CategoryNavItem[];
}

export function Footer({ categories = [] }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#0B1220] text-white pt-14 pb-20 md:pb-12 border-t border-[#131C33] overflow-hidden select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-[#131C33]">
          {/* Column 1: Newsletter & Brand (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-1">
                ZAPPMART<span className="w-2 h-2 rounded-full bg-[#FF4D2E] inline-block mb-1"></span>
              </span>
            </Link>

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFB020]">
              Stay Updated with Trending Deals
            </h3>

            <p className="text-xs md:text-sm text-[#8A92A6] max-w-sm font-normal leading-relaxed">
              Sign up to receive exclusive early access to flash sales, new trending product arrivals, and special discount codes.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-[#131C33] border border-[#12B76A]/40 text-[#12B76A] text-xs px-4 py-2.5 rounded-full font-medium">
                <Check className="w-4 h-4" />
                <span>Thank you! You are subscribed to ZappMart updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-[#131C33] text-white placeholder:text-[#5B6478] text-xs md:text-sm px-4 py-3 rounded-l-full border border-[#131C33] focus:outline-none focus:border-[#FF4D2E]"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF4D2E] to-[#FF7A45] hover:opacity-95 text-white px-6 rounded-r-full flex items-center justify-center transition focus:outline-none cursor-pointer"
                  aria-label="Submit newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Column 2: Main Menu (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFB020]">
              Categories & Menu
            </h4>
            <ul className="space-y-2 text-xs text-[#8A92A6]">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/collections/${cat.slug}`} className="hover:text-white transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFB020]">
              Customer Care & Policy
            </h4>
            <ul className="space-y-2 text-xs text-[#8A92A6]">
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="hover:text-white transition">
                  Refund & Return Policy (7 Days)
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition">
                  Shipping Policy (100% Free Nationwide)
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/923302867560"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-semibold"
                >
                  WhatsApp: +92 324 5003393
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A92A6]">
          <p>© {new Date().getFullYear()} ZAPPMART. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="text-white/80 font-medium">100% Cash on Delivery Across Pakistan</span>
            <span className="text-[#131C33]">|</span>
            <span className="text-[#12B76A] font-semibold flex items-center gap-1">
              ✓ Verified Quality & Fast Dispatch
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
