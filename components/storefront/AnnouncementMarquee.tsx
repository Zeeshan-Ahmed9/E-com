"use client";

interface AnnouncementMarqueeProps {
  text?: string;
  speed?: number;
}

export function AnnouncementMarquee({
  text = "RS 300 ADVANCE PAYMENT REQUIRED FOR ORDER CONFIRMATION • FREE DELIVERY ACROSS PAKISTAN (5-7 WORKING DAYS) • OUTLET COMING SOON",
}: AnnouncementMarqueeProps) {
  // Repeat text to ensure seamless continuous scroll
  const items = Array(6).fill(text);

  return (
    <div className="bg-black text-white text-[11px] md:text-xs font-semibold uppercase tracking-wider py-2 overflow-hidden border-b border-neutral-900 select-none">
      <div className="flex w-max animate-marquee-infinite items-center gap-12 whitespace-nowrap">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span>{item}</span>
            <span className="text-neutral-500">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

