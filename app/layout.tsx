import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppFloatingButton } from "@/components/storefront/WhatsAppFloatingButton";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export const metadata: Metadata = {
  title: "ZappMart — Online Shopping in Pakistan | Cash on Delivery",
  description:
    "Trending lifestyle products, gadgets, home & kitchen essentials with 100% Cash on Delivery across Pakistan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col font-sans bg-[#F6F7FB] text-[#0B1220]">
        {children}
        <CartDrawer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
