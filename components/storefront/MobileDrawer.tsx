"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight, MessageCircle, ShoppingBag, Home, Phone, Grid } from "lucide-react";

interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: CategoryNavItem[];
}

export function MobileDrawer({ isOpen, onClose, categories = [] }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const mainLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "All Products", href: "/products", icon: ShoppingBag },
    { name: "Contact Us", href: "/contact", icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Body */}
      <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="font-extrabold text-xl tracking-tight text-neutral-950">
            ZAPPMART
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* Main 3 Navigation Items */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block mb-3">
              Menu
            </span>
            <ul className="space-y-1">
              {mainLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between py-3 text-sm font-semibold border-b border-neutral-50 transition ${
                        isActive
                          ? "text-black bg-neutral-50 px-2 rounded"
                          : "text-neutral-800 hover:text-black"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-neutral-500" />
                        {item.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Categories Filter */}
          {categories.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block mb-3">
                Browse Categories
              </span>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/collections/${category.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 text-xs font-medium text-neutral-600 hover:text-black transition"
                    >
                      <span className="flex items-center gap-2">
                        <Grid className="w-3 h-3 text-neutral-400" />
                        {category.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* WhatsApp Direct Help */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block mb-3">
              Fast Support
            </span>
            <div className="space-y-2">
              <a
                href="https://wa.me/923245003393?text=Hello%20ZappMart!%20I%20have%20an%20inquiry%20regarding%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-brand-whatsapp text-white py-2.5 rounded text-xs font-semibold uppercase tracking-wider shadow-xs hover:opacity-95 transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Chat on WhatsApp
              </a>

              <Link
                href="/contact"
                onClick={onClose}
                className="block text-center text-xs text-neutral-500 hover:text-black py-1 font-medium"
              >
                View Full Contact Information
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-4 bg-neutral-950 text-white text-center">
          <p className="text-[11px] font-semibold tracking-wider uppercase">
            CASH ON DELIVERY ACROSS PAKISTAN
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            100% Inspected & Verified Products
          </p>
        </div>
      </div>
    </div>
  );
}
