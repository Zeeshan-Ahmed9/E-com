interface MarqueeTickerProps {
  text?: string;
}

export function MarqueeTicker({
  text = "🎉 ZAPPMART OUTLET COMING SOON — Get Ready for Amazing Deals & Exclusive Collections ✨",
}: MarqueeTickerProps) {
  const items = Array(8).fill(text);

  return (
    <div className="bg-black text-white py-3 md:py-4 overflow-hidden border-y border-neutral-900 select-none">
      <div className="flex w-max animate-marquee-infinite items-center gap-12 whitespace-nowrap text-xs md:text-sm font-bold uppercase tracking-wider">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span>{item}</span>
            <span className="text-brand-gold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

