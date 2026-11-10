import { NextResponse } from "next/server";
import { placeOrder } from "@/app/actions/checkout";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await placeOrder(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

