"use server";

import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  serializeProduct,
  serializeProducts,
  serializeCategories,
  serializeOrders,
  SerializedProduct,
  SerializedCategory,
  SerializedOrder,
} from "@/lib/serialize";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface AdminDashboardData {
  products: SerializedProduct[];
  categories: SerializedCategory[];
  orders: SerializedOrder[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    totalProducts: number;
    activeProducts: number;
  };
}

/**
 * Fetch all products, categories, orders, and calculated stats for the admin dashboard.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return await withDbRetry(async () => {
    const [rawProducts, rawCategories, rawOrders] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
    ]);

    const products = serializeProducts(rawProducts);
    const categories = serializeCategories(rawCategories);
    const orders = serializeOrders(rawOrders);

    // Calculate store stats
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== "CANCELLED")
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING").length;
    const confirmedOrders = orders.filter((o) => o.orderStatus === "CONFIRMED").length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === "DELIVERED").length;
    const activeProducts = products.filter((p) => p.status === "ACTIVE").length;

    return {
      products,
      categories,
      orders,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalProducts: products.length,
        activeProducts,
      },
    };
  });
}

export interface CreateProductInput {
  name: string;
  categoryId: string;
  newCategoryName?: string;
  regularPrice: number;
  salePrice: number;
  stockQuantity: number;
  description: string;
  badge?: string;
  isFeatured?: boolean;
  status?: "ACTIVE" | "DRAFT";
  imageUrl?: string;
  imageUrls?: string[];
  imagePublicId?: string;
}

/**
 * Create a new product with multiple images and dynamic category, then revalidate storefront.
 */
export async function createProduct(input: CreateProductInput): Promise<{
  success: boolean;
  product?: SerializedProduct;
  error?: string;
}> {
  try {
    const {
      name,
      categoryId,
      newCategoryName,
      regularPrice,
      salePrice,
      stockQuantity,
      description,
      badge,
      isFeatured = false,
      status = "ACTIVE",
      imageUrl,
      imageUrls,
      imagePublicId = "",
    } = input;

    if (!name || name.trim().length < 2) {
      return { success: false, error: "Product name is required (at least 2 characters)." };
    }

    if (!salePrice || Number(salePrice) <= 0) {
      return { success: false, error: "Valid sale price is required." };
    }

    // Support both single imageUrl and multiple imageUrls array (2, 3 or more images)
    const effectiveImages: string[] =
      imageUrls && imageUrls.length > 0
        ? imageUrls.map((u) => u.trim()).filter((u) => u.length > 4)
        : imageUrl && imageUrl.trim().length > 4
        ? [imageUrl.trim()]
        : [];

    if (effectiveImages.length === 0) {
      return {
        success: false,
        error: "At least one product image is required (upload 1, 2, or 3 images).",
      };
    }

    return await withDbRetry(async () => {
      let targetCategoryId = categoryId;

      // Inline creation of category if user typed a new one
      if (newCategoryName && newCategoryName.trim()) {
        const catSlug = slugify(newCategoryName.trim());
        const existingCat = await prisma.category.findUnique({
          where: { slug: catSlug },
        });

        if (existingCat) {
          targetCategoryId = existingCat.id;
        } else {
          const newCat = await prisma.category.create({
            data: {
              name: newCategoryName.trim(),
              slug: catSlug,
              description: `${newCategoryName.trim()} products at ZappMart`,
              imageUrl: effectiveImages[0] || "",
            },
          });
          targetCategoryId = newCat.id;
        }
      }

      if (!targetCategoryId) {
        // Fallback to first existing category
        const firstCat = await prisma.category.findFirst();
        if (!firstCat) {
          const defaultCat = await prisma.category.create({
            data: {
              name: "General",
              slug: "general",
              description: "General multi-category products",
            },
          });
          targetCategoryId = defaultCat.id;
        } else {
          targetCategoryId = firstCat.id;
        }
      }

      // Generate unique product slug
      const baseSlug = slugify(name);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const rawProduct = await prisma.product.create({
        data: {
          name: name.trim(),
          slug: uniqueSlug,
          description:
            description?.trim() || `${name.trim()} - Premium quality guaranteed at ZappMart.`,
          regularPrice: Number(regularPrice) || Number(salePrice),
          salePrice: Number(salePrice),
          stockQuantity: Number(stockQuantity) || 10,
          status: status === "DRAFT" ? "DRAFT" : "ACTIVE",
          badge: badge?.trim() || null,
          isFeatured: Boolean(isFeatured),
          categoryId: targetCategoryId,
          images: {
            create: effectiveImages.map((imgUrl, sortIdx) => ({
              url: imgUrl,
              publicId: sortIdx === 0 ? imagePublicId || "" : "",
              alt: `${name.trim()} view ${sortIdx + 1}`,
              sortOrder: sortIdx,
            })),
          },
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
      });

      // Revalidate storefront routes immediately
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${uniqueSlug}`);
      revalidatePath("/collections/[slug]", "page");

      return {
        success: true,
        product: serializeProduct(rawProduct) as SerializedProduct,
      };
    });
  } catch (err: any) {
    console.error("[Create Product Error]:", err);
    return { success: false, error: err?.message || "Failed to create product" };
  }
}

export interface UpdateProductInput {
  name: string;
  categoryId: string;
  regularPrice: number;
  salePrice: number;
  stockQuantity: number;
  description: string;
  badge?: string;
  isFeatured?: boolean;
  status: "ACTIVE" | "DRAFT";
  imageUrl?: string;
  imageUrls?: string[];
}

/**
 * Update existing product details, price, inventory or status.
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<{ success: boolean; error?: string }> {
  try {
    return await withDbRetry(async () => {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name: input.name.trim(),
          description: input.description.trim(),
          regularPrice: Number(input.regularPrice),
          salePrice: Number(input.salePrice),
          stockQuantity: Number(input.stockQuantity),
          status: input.status,
          badge: input.badge?.trim() || null,
          isFeatured: Boolean(input.isFeatured),
          categoryId: input.categoryId,
        },
      });

      // Update multiple images if provided, or single image fallback
      if (input.imageUrls && input.imageUrls.length > 0) {
        const cleanUrls = input.imageUrls.map((u) => u.trim()).filter((u) => u.length > 4);
        if (cleanUrls.length > 0) {
          await prisma.productImage.deleteMany({
            where: { productId: id },
          });
          await prisma.productImage.createMany({
            data: cleanUrls.map((url, sortIdx) => ({
              productId: id,
              url,
              alt: `${input.name.trim()} view ${sortIdx + 1}`,
              sortOrder: sortIdx,
            })),
          });
        }
      } else if (input.imageUrl && input.imageUrl.trim()) {
        const existingImg = await prisma.productImage.findFirst({
          where: { productId: id },
        });

        if (existingImg) {
          await prisma.productImage.update({
            where: { id: existingImg.id },
            data: { url: input.imageUrl.trim() },
          });
        } else {
          await prisma.productImage.create({
            data: {
              productId: id,
              url: input.imageUrl.trim(),
              sortOrder: 0,
            },
          });
        }
      }

      revalidatePath("/");
      revalidatePath("/products");
      if (updatedProduct?.slug) {
        revalidatePath(`/products/${updatedProduct.slug}`);
      }
      revalidatePath("/collections/[slug]", "page");

      return { success: true };
    });
  } catch (err: any) {
    console.error("[Update Product Error]:", err);
    return { success: false, error: err?.message || "Failed to update product" };
  }
}

/**
 * Toggle product status quickly between ACTIVE and DRAFT.
 */
export async function toggleProductStatus(
  id: string,
  currentStatus: "ACTIVE" | "DRAFT"
): Promise<{ success: boolean; newStatus?: "ACTIVE" | "DRAFT"; error?: string }> {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE";
    return await withDbRetry(async () => {
      await prisma.product.update({
        where: { id },
        data: { status: newStatus },
      });

      revalidatePath("/");
      revalidatePath("/products");

      return { success: true, newStatus };
    });
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to toggle status" };
  }
}

/**
 * Delete a product from database.
 */
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    return await withDbRetry(async () => {
      await prisma.product.delete({
        where: { id },
      });

      revalidatePath("/");
      revalidatePath("/products");

      return { success: true };
    });
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete product" };
  }
}

/**
 * Update Order Status (PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED / CANCELLED).
 */
export async function updateOrderStatus(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
): Promise<{ success: boolean; error?: string }> {
  try {
    return await withDbRetry(async () => {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: status },
      });

      revalidatePath(`/order-success/${order.orderNumber}`);

      return { success: true };
    });
  } catch (err: any) {
    console.error("[Update Order Status Error]:", err);
    return { success: false, error: err?.message || "Failed to update order status" };
  }
}

/**
 * Delete / Archive Order.
 */
export async function deleteOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    return await withDbRetry(async () => {
      await prisma.order.delete({
        where: { id: orderId },
      });

      return { success: true };
    });
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete order" };
  }
}

/**
 * Create a new dynamic category.
 */
export async function createCategory(name: string, description?: string): Promise<{
  success: boolean;
  category?: SerializedCategory;
  error?: string;
}> {
  try {
    const slug = slugify(name);
    return await withDbRetry(async () => {
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        return { success: false, error: "A category with this name already exists." };
      }

      const cat = await prisma.category.create({
        data: {
          name: name.trim(),
          slug,
          description: description?.trim() || `${name.trim()} collection at ZappMart`,
        },
      });

      revalidatePath("/");
      revalidatePath("/products");

      return {
        success: true,
        category: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          imageUrl: cat.imageUrl,
          isFeatured: cat.isFeatured,
          sortOrder: cat.sortOrder,
          createdAt: cat.createdAt.toISOString(),
          updatedAt: cat.updatedAt.toISOString(),
        },
      };
    });
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create category" };
  }
}

