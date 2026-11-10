import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { WhatsAppFloatingButton } from "@/components/storefront/WhatsAppFloatingButton";
import { CartDrawer } from "@/components/storefront/CartDrawer";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZappMart — Online Shopping in Pakistan | Cash on Delivery",
  description:
    "Shop trending gadgets, home essentials, kitchen tools, toys, and accessories with free nationwide delivery and Cash on Delivery across Pakistan.",
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
    <html lang="en" className={jost.variable}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-[#fdfdfd] text-[#1a1a1a]">
        {children}
        <CartDrawer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}

