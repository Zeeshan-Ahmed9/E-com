/**
 * Utility to convert Prisma models (containing Decimal, Date, and other non-POJO classes)
 * into Plain Old JavaScript Objects (POJOs) for Next.js React Server Component boundary passing.
 * Completely eliminates the Next.js RSC error:
 * "Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported."
 */

export interface SerializedProductImage {
  id: string;
  url: string;
  publicId: string;
  alt: string | null;
  sortOrder: number;
}

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  regularPrice: number;
  salePrice: number;
  stockQuantity: number;
  status: "ACTIVE" | "DRAFT";
  badge: string | null;
  isFeatured: boolean;
  viewsCount: number;
  categoryId: string;
  category?: {
    id?: string;
    name: string;
    slug: string;
  } | null;
  images: SerializedProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface SerializedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface SerializedOrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  variantInfo: string | null;
}

export interface SerializedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  city: string;
  postalCode: string | null;
  orderNotes: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "COD" | "WHATSAPP";
  orderStatus: string;
  items: SerializedOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export function serializeProduct(product: any): SerializedProduct | null {
  if (!product) return null;

  return {
    id: String(product.id || ""),
    name: String(product.name || ""),
    slug: String(product.slug || ""),
    description: String(product.description || ""),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : 0,
    salePrice: product.salePrice ? Number(product.salePrice) : 0,
    stockQuantity: Number(product.stockQuantity || 0),
    status: product.status || "ACTIVE",
    badge: product.badge ? String(product.badge) : null,
    isFeatured: Boolean(product.isFeatured),
    viewsCount: Number(product.viewsCount || 20),
    categoryId: String(product.categoryId || ""),
    category: product.category
      ? {
          id: product.category.id ? String(product.category.id) : undefined,
          name: String(product.category.name || ""),
          slug: String(product.category.slug || ""),
        }
      : null,
    images: Array.isArray(product.images)
      ? product.images.map((img: any) => ({
          id: String(img.id || ""),
          url: String(img.url || ""),
          publicId: String(img.publicId || ""),
          alt: img.alt ? String(img.alt) : null,
          sortOrder: Number(img.sortOrder || 0),
        }))
      : [],
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function serializeProducts(products: any[]): SerializedProduct[] {
  if (!Array.isArray(products)) return [];
  return products.map(serializeProduct).filter(Boolean) as SerializedProduct[];
}

export function serializeCategory(category: any): SerializedCategory | null {
  if (!category) return null;

  return {
    id: String(category.id || ""),
    name: String(category.name || ""),
    slug: String(category.slug || ""),
    description: category.description ? String(category.description) : null,
    imageUrl: category.imageUrl ? String(category.imageUrl) : null,
    isFeatured: Boolean(category.isFeatured),
    sortOrder: Number(category.sortOrder || 0),
    createdAt: category.createdAt
      ? new Date(category.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: category.updatedAt
      ? new Date(category.updatedAt).toISOString()
      : new Date().toISOString(),
    _count: category._count
      ? {
          products: Number(category._count.products || 0),
        }
      : undefined,
  };
}

export function serializeCategories(categories: any[]): SerializedCategory[] {
  if (!Array.isArray(categories)) return [];
  return categories.map(serializeCategory).filter(Boolean) as SerializedCategory[];
}

export function serializeOrder(order: any): SerializedOrder | null {
  if (!order) return null;

  return {
    id: String(order.id || ""),
    orderNumber: String(order.orderNumber || ""),
    customerName: String(order.customerName || ""),
    customerPhone: String(order.customerPhone || ""),
    customerEmail: order.customerEmail ? String(order.customerEmail) : null,
    shippingAddress: String(order.shippingAddress || ""),
    city: String(order.city || ""),
    postalCode: order.postalCode ? String(order.postalCode) : null,
    orderNotes: order.orderNotes ? String(order.orderNotes) : null,
    subtotal: order.subtotal ? Number(order.subtotal) : 0,
    shippingFee: order.shippingFee ? Number(order.shippingFee) : 0,
    totalAmount: order.totalAmount ? Number(order.totalAmount) : 0,
    paymentMethod: order.paymentMethod || "COD",
    orderStatus: String(order.orderStatus || "PENDING"),
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          id: String(item.id || ""),
          orderId: String(item.orderId || ""),
          productId: item.productId ? String(item.productId) : null,
          productName: String(item.productName || ""),
          price: item.price ? Number(item.price) : 0,
          quantity: Number(item.quantity || 1),
          imageUrl: item.imageUrl ? String(item.imageUrl) : null,
          variantInfo: item.variantInfo ? String(item.variantInfo) : null,
        }))
      : [],
    createdAt: order.createdAt
      ? new Date(order.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: order.updatedAt
      ? new Date(order.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function serializeOrders(orders: any[]): SerializedOrder[] {
  if (!Array.isArray(orders)) return [];
  return orders.map(serializeOrder).filter(Boolean) as SerializedOrder[];
}

export function serializeStoreSetting(setting: any) {
  if (!setting) return null;
  return {
    id: String(setting.id || "default"),
    storeName: String(setting.storeName || "ZappMart"),
    announcementText: String(
      setting.announcementText ||
        "FREE DELIVERY ACROSS PAKISTAN (5-7 WORKING DAYS) • 100% CASH ON DELIVERY AVAILABLE • FLAT 15% OFF"
    ),
    marqueeSpeed: Number(setting.marqueeSpeed || 20),
    whatsappNumber: String(setting.whatsappNumber || "923245003393"),
    outletBannerText: String(setting.outletBannerText || "Special Deals Available Now!"),
    updatedAt: setting.updatedAt
      ? new Date(setting.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

