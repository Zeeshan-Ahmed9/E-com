"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationBar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="hidden md:block bg-black text-white border-b border-neutral-900 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center gap-10 py-3.5 text-[13px] font-semibold tracking-wider uppercase">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href) ||
                  (link.href === "/products" && pathname?.startsWith("/collections"));

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`py-1.5 transition-colors relative ${
                    isActive
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
