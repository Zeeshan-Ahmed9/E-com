import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Initializing ZappMart dynamic catalog...");

  // 1. Delete all existing records cleanly
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 2. Initialize ZappMart Store Settings
  await prisma.storeSetting.create({
    data: {
      id: "default",
      storeName: "ZappMart",
      announcementText:
        "RS 300 ADVANCE PAYMENT REQUIRED FOR ORDER CONFIRMATION • FREE DELIVERY ACROSS PAKISTAN (5-7 WORKING DAYS) • OUTLET COMING SOON",
      marqueeSpeed: 22,
      whatsappNumber: "923245003393",
      outletBannerText:
        "🎉 ZAPPMART OUTLET COMING SOON — Get Ready for Amazing Deals & Exclusive Collections ✨",
    },
  });
  console.log("✅ ZappMart store settings initialized");

  // 3. Create Dynamic Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Smart gadgets, chargers, audio gear, and everyday tech accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 1,
    },
  });

  const catKitchen = await prisma.category.create({
    data: {
      name: "Kitchen & Dining",
      slug: "kitchen-dining",
      description: "Convenient kitchen tools, organizers, gadgets, and dining essentials",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 2,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: "Home Products",
      slug: "home-products",
      description: "Functional home decor, storage, lighting, and living improvements",
      imageUrl:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 3,
    },
  });

  const catToys = await prisma.category.create({
    data: {
      name: "Toys & Games",
      slug: "toys-games",
      description: "Fun learning toys, remote control cars, and kids activities",
      imageUrl:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 4,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Daily lifestyle accessories, bags, straps, and travel gear",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 5,
    },
  });

  console.log("✅ 5 Dynamic Categories created");

  // 4. Seed Multi-Category Products
  const products = [
    {
      name: "Wireless ANC Over-Ear Headphones",
      slug: "wireless-anc-headphones",
      description:
        "Premium Bluetooth headphones with Hybrid Active Noise Cancellation, 40mm dynamic drivers, ultra-soft memory protein ear pads, and up to 45 hours battery life with fast Type-C charging.",
      regularPrice: 4800.0,
      salePrice: 3850.0,
      stockQuantity: 28,
      status: ProductStatus.ACTIVE,
      badge: "-20%",
      isFeatured: true,
      categoryId: catElectronics.id,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Smart Watch Ultra with Fitness Tracker",
      slug: "smart-watch-ultra",
      description:
        "Large 2.0-inch HD infinite display with rugged aerospace-grade alloy casing, heart rate monitor, sleep tracking, dual straps, and Bluetooth calling capabilities.",
      regularPrice: 4200.0,
      salePrice: 3250.0,
      stockQuantity: 35,
      status: ProductStatus.ACTIVE,
      badge: "-23%",
      isFeatured: true,
      categoryId: catElectronics.id,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Multi-Functional 4-in-1 Vegetable Slicer & Dicer",
      slug: "4-in-1-vegetable-chopper",
      description:
        "Heavy-duty kitchen chopper with 4 interchangeable German stainless steel blades, non-slip catch container, and safety finger guard. Cuts meal prep time in half.",
      regularPrice: 2800.0,
      salePrice: 1999.0,
      stockQuantity: 42,
      status: ProductStatus.ACTIVE,
      badge: "-28%",
      isFeatured: true,
      categoryId: catKitchen.id,
      images: [
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Smart LED Sunset Projection Ambient Lamp",
      slug: "smart-sunset-lamp",
      description:
        "180-degree rotatable romantic sunset projector lamp. Features 16 RGB color modes, remote control, and dimmer settings for stunning room aesthetic and content creation.",
      regularPrice: 2400.0,
      salePrice: 1650.0,
      stockQuantity: 30,
      status: ProductStatus.ACTIVE,
      badge: "-31%",
      isFeatured: true,
      categoryId: catHome.id,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "High-Speed 4WD Stunt Remote Control Car",
      slug: "remote-control-stunt-car",
      description:
        "Double-sided tumbling RC stunt car with 360-degree high-speed rotation, shock-absorbing oversized rubber tires, bright LED headlights, and 2 rechargeable battery packs.",
      regularPrice: 3500.0,
      salePrice: 2750.0,
      stockQuantity: 20,
      status: ProductStatus.ACTIVE,
      badge: "-21%",
      isFeatured: true,
      categoryId: catToys.id,
      images: [
        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Water-Resistant Daily Travel Backpack with USB Port",
      slug: "water-resistant-travel-backpack",
      description:
        "Durable Oxford fabric backpack with anti-theft hidden pocket, 15.6-inch padded laptop compartment, integrated external USB pass-through port, and ergonomic breathable shoulder straps.",
      regularPrice: 4200.0,
      salePrice: 3200.0,
      stockQuantity: 25,
      status: ProductStatus.ACTIVE,
      badge: "-24%",
      isFeatured: true,
      categoryId: catAccessories.id,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Rechargeable Barista Handheld Milk Frother",
      slug: "electric-milk-frother",
      description:
        "High-RPM cordless electric whisk with double spring stainless steel head. Quickly crafts velvety foam for cappuccino, latte, matcha, and protein shakes.",
      regularPrice: 1800.0,
      salePrice: 1350.0,
      stockQuantity: 38,
      status: ProductStatus.ACTIVE,
      badge: "-25%",
      isFeatured: false,
      categoryId: catKitchen.id,
      images: [
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Minimalist Matte Ceramic Aromatherapy Diffuser",
      slug: "ceramic-aromatherapy-diffuser",
      description:
        "Quiet ultrasonic cool mist humidifier with handcrafted ceramic cover, 7 soothing ambient night light colors, and auto shut-off safety sensor.",
      regularPrice: 3900.0,
      salePrice: 2999.0,
      stockQuantity: 18,
      status: ProductStatus.ACTIVE,
      badge: "-23%",
      isFeatured: false,
      categoryId: catHome.id,
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Kids Educational Magic Writing LCD Tablet",
      slug: "kids-magic-lcd-tablet",
      description:
        "10-inch eye-protection color drawing pad with pressure-sensitive stylus, 1-touch screen erase button, and lock function. Safe, paperless fun for creative children.",
      regularPrice: 1600.0,
      salePrice: 1199.0,
      stockQuantity: 50,
      status: ProductStatus.ACTIVE,
      badge: "-25%",
      isFeatured: false,
      categoryId: catToys.id,
      images: [
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Magnetic Car Phone Mount 360 Rotation",
      slug: "magnetic-car-phone-mount",
      description:
        "Ultra-strong N52 neodymium magnetic dashboard and air-vent mount. Securely holds all smartphones even on rough road conditions with 360° angle flexibility.",
      regularPrice: 1500.0,
      salePrice: 999.0,
      stockQuantity: 45,
      status: ProductStatus.ACTIVE,
      badge: "-33%",
      isFeatured: false,
      categoryId: catAccessories.id,
      images: [
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop",
      ],
    },
  ];

  for (const item of products) {
    const { images, ...productFields } = item;
    const prod = await prisma.product.create({
      data: productFields,
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: prod.id,
          url: images[i],
          sortOrder: i,
          alt: `${prod.name} view ${i + 1}`,
        },
      });
    }
  }

  console.log(`✅ Seeded ${products.length} multi-category products for ZappMart.`);
  console.log("✨ ZappMart Database Seed Complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
