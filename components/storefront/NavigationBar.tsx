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
    <nav className="hidden md:block bg-white text-[#0B1220] border-b border-[#E7EAF3] select-none shadow-2xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center gap-10 py-3 text-[13px] font-bold tracking-wide uppercase font-sans">
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
                  className={`py-1.5 transition-colors relative cursor-pointer ${
                    isActive
                      ? "text-[#FF4D2E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#FF4D2E] after:rounded-full"
                      : "text-[#5B6478] hover:text-[#0B1220]"
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
