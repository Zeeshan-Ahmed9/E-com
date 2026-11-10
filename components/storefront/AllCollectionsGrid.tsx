import Link from "next/link";
import Image from "next/image";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count: {
    products: number;
  };
}

interface AllCollectionsGridProps {
  categories: CategoryWithCount[];
}

export function AllCollectionsGrid({ categories }: AllCollectionsGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="all-collections" className="py-14 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950 font-sans">
          All Collections
        </h2>
        <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
      </div>

      {/* 2-Column Grid on Mobile, 2 or 4 Columns on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group block relative overflow-hidden rounded-lg bg-neutral-100 transition-all duration-300"
          >
            {/* Image Container with 1:1 Aspect Ratio */}
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold text-lg">
                  {category.name}
                </div>
              )}

              {/* Subtle gradient vignette at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Category Name & Superscript Count */}
            <div className="py-3.5 text-center bg-white group-hover:bg-neutral-50 transition-colors">
              <h3 className="text-sm md:text-base font-semibold text-neutral-900 tracking-tight inline-flex items-center justify-center gap-1">
                <span>{category.name}</span>
                <sup className="text-[11px] font-bold text-neutral-500 font-sans">
                  {category._count?.products ?? 0}
                </sup>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

