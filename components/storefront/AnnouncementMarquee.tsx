"use client";

interface AnnouncementMarqueeProps {
  text?: string;
  speed?: number;
}

export function AnnouncementMarquee({
  text = "Assalamu Alaikum! 🚚 FREE delivery all over Pakistan 🇵🇰 • 100% Cash on Delivery Available ✨ • 7-Day Easy Replacement",
}: AnnouncementMarqueeProps) {
  const items = Array(6).fill(text);

  return (
    <div className="bg-[#0B1220] text-white text-[11px] md:text-xs font-medium tracking-wide py-2.5 overflow-hidden border-b border-[#131C33] select-none shadow-sm">
      <div className="flex w-max animate-marquee-infinite items-center gap-12 whitespace-nowrap">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span>{item}</span>
            <span className="text-[#FFB020] font-bold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
