"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, MessageSquare } from "lucide-react";

export function CustomerReviews() {
  const reviews = [
    {
      name: "Muhammad Usman",
      city: "Karachi",
      product: "Wireless ANC Headphones",
      rating: 5,
      date: "2 days ago",
      comment:
        "Bhai parcel mil gaya hai. Packaging bohat zabardast thi aur sound quality next level hai! Battery backup bhi accurate hai. 10/10 recommended for ZappMart!",
      verified: true,
    },
    {
      name: "Ayesha Tariq",
      city: "Lahore",
      product: "4-in-1 Vegetable Slicer",
      rating: 5,
      date: "4 days ago",
      comment:
        "Assalam o alaikum! Received the vegetable cutter today. Blades bohat sharp hain and makes kitchen work so easy. Shukriya fast delivery k liye!",
      verified: true,
    },
    {
      name: "Bilal Ahmed",
      city: "Islamabad",
      product: "Water-Resistant Backpack",
      rating: 5,
      date: "1 week ago",
      comment:
        "The bag quality is superior. Zipper is smooth, lots of pockets, laptop fits perfectly. Cash on delivery process was super smooth.",
      verified: true,
    },
    {
      name: "Hina Zubair",
      city: "Rawalpindi",
      product: "Smart Sunset Lamp",
      rating: 5,
      date: "1 week ago",
      comment:
        "Loved the sunset lamp! Colors are so aesthetic and vibrant in the room. Thank you ZappMart team for quick WhatsApp guidance.",
      verified: true,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* 5 Stars */}
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Hear From Our Happy Customers
          </h2>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto mt-2 font-normal">
            Real customers share why ZappMart has become their favorite destination for verified online shopping.
          </p>
        </motion.div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-5 md:p-6 shadow-2xs hover:shadow-xl hover:bg-white transition-all duration-300 flex flex-col justify-between"
            >
              {/* WhatsApp message style card */}
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        {rev.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {rev.city}, PK
                      </span>
                    </div>
                  </div>

                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle className="w-3 h-3 fill-emerald-600 text-white" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 text-amber-400 mb-2.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-semibold text-neutral-800 truncate max-w-[150px]">
                  {rev.product}
                </span>
                <span>{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
