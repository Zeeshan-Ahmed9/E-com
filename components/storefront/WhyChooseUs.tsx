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
    <section className="py-14 md:py-20 bg-white border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
            Why Choose ZappMart
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-6 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-black mb-4 shadow-xs">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-neutral-900 uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-500 max-w-xs font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

