import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up old luxury seed data and records...");

  // 1. Delete all existing records cleanly
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.storeSetting.deleteMany();

  // If users table still exists from previous migration, clean it up raw
  try {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "users" CASCADE;');
    await prisma.$executeRawUnsafe('DROP TYPE IF EXISTS "Role" CASCADE;');
  } catch (e) {
    // Ignore if already dropped
  }

  console.log("✅ Previous luxury data and user accounts cleaned.");

  // 2. Initialize General Store Settings
  await prisma.storeSetting.create({
    data: {
      id: "default",
      storeName: "2S STORE",
      announcementText:
        "FREE SHIPPING NATIONWIDE (5-7 WORKING DAYS) • CASH ON DELIVERY AVAILABLE",
      marqueeSpeed: 22,
      whatsappNumber: "923245003393",
      outletBannerText:
        "🎉 Special Deals & New Arrivals Available Across All Categories! ✨",
    },
  });
  console.log("✅ General store settings initialized");

  // 3. Create Neutral Multi-Category Categories
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

  console.log("✅ 5 Neutral Dynamic Categories created");

  // 4. Seed Neutral Multi-Category Test Products
  const generalProducts = [
    {
      name: "Wireless Active Noise Cancelling Headphones",
      slug: "wireless-anc-headphones",
      description:
        "High-definition over-ear Bluetooth headphones with hybrid active noise cancellation, deep bass response, and up to 40 hours of playtime on a single charge.",
      regularPrice: 4500.0,
      salePrice: 3850.0,
      stockQuantity: 25,
      status: ProductStatus.ACTIVE,
      badge: "-14%",
      isFeatured: true,
      categoryId: catElectronics.id,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Multi-Functional 4-in-1 Vegetable Chopper & Slicer",
      slug: "4-in-1-vegetable-chopper",
      description:
        "Heavy-duty stainless steel blades with interchangeable cutting discs. Perfect for slicing, dicing, and grating veggies quickly with minimal cleanup.",
      regularPrice: 2800.0,
      salePrice: 1999.0,
      stockQuantity: 40,
      status: ProductStatus.ACTIVE,
      badge: "-28%",
      isFeatured: true,
      categoryId: catKitchen.id,
      images: [
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Smart LED Sunset Projection Lamp",
      slug: "smart-sunset-lamp",
      description:
        "Create warm ambient lighting for your living room or bedroom. Includes 16 customizable RGB color modes with remote control.",
      regularPrice: 2200.0,
      salePrice: 1650.0,
      stockQuantity: 30,
      status: ProductStatus.ACTIVE,
      badge: "-25%",
      isFeatured: true,
      categoryId: catHome.id,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "High-Speed Remote Control 4WD Stunt Car",
      slug: "remote-control-stunt-car",
      description:
        "All-terrain 360-degree rotating stunt car with shockproof rubber tires, dual motors, and USB rechargeable battery pack.",
      regularPrice: 3500.0,
      salePrice: 2750.0,
      stockQuantity: 15,
      status: ProductStatus.ACTIVE,
      badge: "-21%",
      isFeatured: true,
      categoryId: catToys.id,
      images: [
        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Water-Resistant Daily Travel Backpack with USB Port",
      slug: "water-resistant-travel-backpack",
      description:
        "Sleek minimalist backpack featuring dedicated 15.6-inch padded laptop sleeve, external USB charging port, and breathable back padding.",
      regularPrice: 4200.0,
      salePrice: 3200.0,
      stockQuantity: 20,
      status: ProductStatus.ACTIVE,
      badge: "-24%",
      isFeatured: true,
      categoryId: catAccessories.id,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Rechargeable Electric Milk Frother & Whisk",
      slug: "electric-milk-frother",
      description:
        "Handheld cordless frother with high-torque motor and double spring head for barista-style coffee, matcha, and lattes in seconds.",
      regularPrice: 1800.0,
      salePrice: 1350.0,
      stockQuantity: 35,
      status: ProductStatus.ACTIVE,
      badge: "-25%",
      isFeatured: false,
      categoryId: catKitchen.id,
      images: [
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
      ],
    },
  ];

  for (const item of generalProducts) {
    const { images, ...productFields } = item;
    const product = await prisma.product.create({
      data: productFields,
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i],
          sortOrder: i,
          alt: `${product.name} view ${i + 1}`,
        },
      });
    }
  }

  console.log(`✅ Seeded ${generalProducts.length} neutral multi-category products.`);
  console.log("✨ General-purpose e-commerce database reset complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
