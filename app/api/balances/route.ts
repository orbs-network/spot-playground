import { getBalances } from "@/lib/get-balances";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { chainId, address, tokens } = await request.json();

  try {
    if (!chainId || !address || !tokens) {
      return NextResponse.json(
        { error: "chainId, address and tokens are required" },
        { status: 400 }
      );
    }
    const balances = await getBalances(Number(chainId), address, tokens);
    return NextResponse.json(balances);
  } catch (error) {
    console.error("Error in POST /api/balances:", error);
    return NextResponse.json({ error: "Failed to get balances" }, { status: 500 });
  }
}
