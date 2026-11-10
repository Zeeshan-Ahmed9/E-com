import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";
import { serializeProducts } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await withDbRetry(async () => {
      return await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 6,
        orderBy: { viewsCount: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
      });
    });

    return NextResponse.json({
      products: serializeProducts(products),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message, products: [] }, { status: 500 });
  }
}

