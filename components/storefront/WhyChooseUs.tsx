"use client";

import { motion } from "framer-motion";
import { Headphones, ShieldCheck, Truck } from "lucide-react";

export function WhyChooseUs() {
  const pillars = [
    {
      icon: Headphones,
      title: "24/7 Dedicated Support",
      description: "Fast responses via WhatsApp and phone call for any order or product inquiry.",
    },
    {
      icon: ShieldCheck,
      title: "100% Safe COD Checkout",
      description: "Pay with complete confidence at your doorstep across all cities in Pakistan.",
    },
    {
      icon: Truck,
      title: "Free Fast Shipping",
      description: "Free nationwide delivery on all items delivered within 5–7 working days.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-t border-neutral-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
            PEACE OF MIND
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Why Choose ZappMart
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-100 hover:border-neutral-200/80 shadow-2xs hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-md">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-neutral-900 uppercase tracking-tight mb-2 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-500 max-w-xs font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
