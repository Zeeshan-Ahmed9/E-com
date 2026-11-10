"use server";

import { prisma, withDbRetry } from "@/lib/prisma";

export interface CheckoutItemPayload {
  productId?: string;
  name?: string;
  productName?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variantInfo?: string;
}

export interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  orderNotes?: string;
  paymentMethod?: "COD" | "WHATSAPP";
  items: CheckoutItemPayload[];
}

export interface PlaceOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      orderNotes,
      paymentMethod = "COD",
      items,
    } = input;

    // 1. Validation
    if (!customerName || customerName.trim().length < 2) {
      return { success: false, error: "Please enter your full name." };
    }

    const cleanPhone = customerPhone?.replace(/\s+/g, "").trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      return {
        success: false,
        error: "Please enter a valid active mobile or WhatsApp number (e.g. 0300 1234567).",
      };
    }

    if (!shippingAddress || shippingAddress.trim().length < 6) {
      return {
        success: false,
        error: "Please enter a complete delivery address (House / Flat, Street, Area).",
      };
    }

    if (!city || city.trim().length < 2) {
      return { success: false, error: "Please select or enter your destination city." };
    }

    if (!items || items.length === 0) {
      return {
        success: false,
        error: "Your shopping bag is empty. Please add items before checking out.",
      };
    }

    // 2. Financial calculation
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Math.max(1, item.quantity),
      0
    );
    const shippingFee = 0; // Free shipping nationwide
    const totalAmount = subtotal + shippingFee;

    // 3. Generate unique order number (e.g. ZM-8492)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ZM-${randomSuffix}`;

    // 4. Create Order in Neon Database via Prisma with retry wrapper
    const order = await withDbRetry(async () => {
      return await prisma.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail?.trim() || null,
          shippingAddress: shippingAddress.trim(),
          city: city.trim(),
          postalCode: postalCode?.trim() || null,
          orderNotes: orderNotes?.trim() || null,
          subtotal,
          shippingFee,
          totalAmount,
          paymentMethod: paymentMethod === "WHATSAPP" ? "WHATSAPP" : "COD",
          orderStatus: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.productId || null,
              productName: item.name || item.productName || "Product",
              price: item.price,
              quantity: Math.max(1, item.quantity),
              imageUrl: item.imageUrl || null,
              variantInfo: item.variantInfo || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    // 5. Decrement inventory counts for linked products (best effort)
    for (const item of items) {
      if (item.productId) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: Math.max(1, item.quantity),
              },
            },
          });
        } catch (e) {
          // If stock decrement fails (e.g. product was deleted), log and continue
          console.warn("[Checkout] Stock decrement notice:", e);
        }
      }
    }

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    };
  } catch (err: any) {
    console.error("[Checkout Server Action Error]:", err?.message || err);
    return {
      success: false,
      error:
        err?.message ||
        "Could not place your order right now. Please check your details or contact us on WhatsApp.",
    };
  }
}

