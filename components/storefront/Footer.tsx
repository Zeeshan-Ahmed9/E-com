"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { WaveDivider } from "./WaveDivider";

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
    <footer className="relative bg-black text-white pt-6 pb-20 md:pb-12 border-t border-neutral-900 overflow-hidden">
      {/* Top Wave Divider */}
      <WaveDivider fillColor="#000000" className="-mt-14 sm:-mt-16 md:-mt-20 mb-8" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-neutral-900">
          {/* Column 1: Newsletter & Brand (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight uppercase text-white font-sans">
                ZAPPMART
              </span>
            </Link>

            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Let&apos;s get in touch
            </h3>

            <p className="text-xs md:text-sm text-neutral-400 max-w-sm font-normal leading-relaxed">
              Sign up for our newsletter and receive <strong>10% off</strong> your first order, plus exclusive early access to flash sales and new arrivals.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs px-4 py-2.5 rounded-full font-medium">
                <Check className="w-4 h-4" />
                <span>Thank you! Check your inbox for your 10% discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-xs md:text-sm px-4 py-2.5 rounded-l border-0 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 rounded-r flex items-center justify-center transition focus:outline-none"
                  aria-label="Submit newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Column 2: Main Menu (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Main Menu
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Useful Links
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="hover:text-white transition">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition">
                  Shipping Policy (5-7 Days Free Delivery)
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/923245003393"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-whatsapp hover:underline font-semibold"
                >
                  WhatsApp: +92 324 5003393
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} ZAPPMART. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="text-neutral-400 font-medium">Cash on Delivery Across Pakistan</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400 font-medium">Safe & Verified Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

