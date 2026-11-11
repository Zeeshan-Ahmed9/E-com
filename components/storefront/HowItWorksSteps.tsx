"use client";

import { ShoppingCart, PackageCheck, Banknote } from "lucide-react";

const STEPS = [
  {
    num: "1",
    icon: ShoppingCart,
    title: "Order With Ease",
    description: "Browse products and place your order in 30 seconds with 100% Cash on Delivery (no account needed).",
  },
  {
    num: "2",
    icon: PackageCheck,
    title: "Fast Nationwide Dispatch",
    description: "Your order is inspected, securely bubble-wrapped, and handed over to TCS/Trax within 24 hours.",
  },
  {
    num: "3",
    icon: Banknote,
    title: "Pay Cash At Doorstep",
    description: "Receive your parcel at home, verify your items, and pay cash directly to the courier rider.",
  },
];

export function HowItWorksSteps() {
  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-white to-[#F6F7FB] border-t border-[#E7EAF3] select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight font-sans">
            How Simple Shopping Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6478] mt-1 font-normal">
            Safe, reliable, and convenient door-to-door delivery anywhere in Pakistan
          </p>
          <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#FF4D2E] to-[#FFB020] mx-auto mt-3" />
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative bg-white border border-[#E7EAF3] rounded-3xl p-6 md:p-8 text-center shadow-[0_4px_20px_rgba(11,18,32,0.04)] hover:shadow-[0_16px_34px_rgba(11,18,32,0.08)] hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Number Badge */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF4D2E] to-[#FFB020] text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  {step.num}
                </div>

                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#F6F7FB] text-[#0B1220] mb-3">
                  <Icon className="w-5 h-5 text-[#FF4D2E]" />
                </div>

                <b className="block text-base sm:text-lg font-bold text-[#0B1220] mb-2 font-sans">
                  {step.title}
                </b>
                <p className="text-xs sm:text-sm text-[#5B6478] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

