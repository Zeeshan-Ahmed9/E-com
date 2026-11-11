"use client";

import { Wallet, Truck, RotateCcw, ShieldCheck } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Wallet,
    title: "Cash on Delivery",
    subtitle: "Pay when you receive",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    subtitle: "Fast shipping to your city",
  },
  {
    icon: RotateCcw,
    title: "Easy Replacement",
    subtitle: "If damaged or wrong item",
  },
  {
    icon: ShieldCheck,
    title: "Tested Quality",
    subtitle: "100% verified items",
  },
];

export function TrustBadgesSection() {
  return (
    <section className="bg-white border-b border-[#E7EAF3] py-5 select-none shadow-2xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F6F7FB] border border-[#E7EAF3]/80 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4D2E] to-[#FF7A45] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <b className="block text-xs sm:text-sm font-bold text-[#0B1220] truncate">
                    {item.title}
                  </b>
                  <span className="block text-[11px] text-[#5B6478] truncate font-medium">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

