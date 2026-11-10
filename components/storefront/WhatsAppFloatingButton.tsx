"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // Hide floating WhatsApp button on admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl =
    "https://wa.me/923245003393?text=Hello%20ZappMart!%20I%20want%20to%20inquire%20about%20a%20product%20from%20your%20store.%20Please%20guide%20me.";

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-7 z-40 select-none">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with ZappMart on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-brand-whatsapp text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 rounded-full bg-brand-whatsapp/40 animate-ping pointer-events-none group-hover:hidden" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-current stroke-none" />

        {/* Tooltip on Desktop hover */}
        <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Chat with Us
        </span>
      </a>
    </div>
  );
}

