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
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Block */}
        <div className="text-center mb-12 md:mb-16">
          {/* 5 Stars */}
          <div className="flex items-center justify-center gap-1 text-brand-gold mb-2">
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
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              {/* WhatsApp message style card */}
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-whatsapp/20 text-brand-whatsapp flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
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
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 text-brand-gold mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-medium text-neutral-600 truncate max-w-[150px]">
                  {rev.product}
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

