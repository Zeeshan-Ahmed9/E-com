"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { WaveDivider } from "./WaveDivider";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "1. Are your products verified for quality?",
      a: "Yes, every product at ZappMart undergoes quality checks before dispatch. We partner directly with verified manufacturers to ensure durability, safe electrical compliance, and genuine everyday functionality.",
    },
    {
      q: "2. How is your packing and order safety?",
      a: "All orders are sealed in multi-layer shockproof bubble wraps and heavy-duty boxes to ensure your items arrive in 100% flawless condition, no matter where you are in Pakistan.",
    },
    {
      q: "3. How long does delivery take across Pakistan?",
      a: "Orders are processed within 24 hours and delivered within 5–7 working days via premier courier partners (TCS, Leopard, PostEx, Trax) with live SMS and tracking updates.",
    },
    {
      q: "4. Do you offer Cash on Delivery (COD) and Free Shipping?",
      a: "Yes! Cash on Delivery (COD) is available nationwide with 100% Free Shipping on all products. No advance payment is needed—you pay the full amount in cash directly to the courier rider upon delivery at your doorstep.",
    },
    {
      q: "5. Can I order or inquire directly on WhatsApp?",
      a: "Absolutely. You can click 'Order on WhatsApp' on any product page or contact our WhatsApp support team at +92 324 5003393 for 1-click ordering, address confirmation, or video previews.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative bg-black text-white pt-10 pb-16 md:pb-24 overflow-hidden">
      {/* Top Wave Divider */}
      <WaveDivider fillColor="#000000" className="-mt-16 md:-mt-20 mb-6" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white font-sans">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 font-normal">
            Everything you need to know about shopping, delivery, and payments at ZappMart.
          </p>
          <div className="w-12 h-0.5 bg-neutral-700 mx-auto mt-3" />
        </motion.div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-800 bg-neutral-900/60 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 py-4 md:py-4.5 flex items-center justify-between text-xs md:text-sm font-semibold text-white hover:text-neutral-200 transition focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 ml-3"
                  >
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
