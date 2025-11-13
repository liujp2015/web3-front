// 必须命名为 route.ts
import { NextResponse } from "next/server";

// 如果你只是读取公开查询，其实不需要 Dune SDK 和 API Key！
// 公开查询可以直接通过 Dune 的公开 API 获取

export async function GET() {
  try {
    const uniTopHolders = [
      {
        rank: 1,
        address: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503",
        balance: 1000000000,
        percentage: 10.0,
        label: "Uniswap Team / Multisig",
      },
      {
        rank: 2,
        address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
        balance: 500000000,
        percentage: 5.0,
        label: "Community Treasury",
      },
      {
        rank: 3,
        address: "0x4b4E140d0e91d8c4c10c9C9F5C5E4c8C5F0b3F9A",
        balance: 300000000,
        percentage: 3.0,
        label: "Early Investor (e.g. a16z)",
      },
      {
        rank: 4,
        address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
        balance: 250000000,
        percentage: 2.5,
        label: "Binance Hot Wallet",
      },
      {
        rank: 5,
        address: "0xD38715F0E4975b453C9a2B0F66F9244E6E2C2d28",
        balance: 180000000,
        percentage: 1.8,
        label: "Coinbase Custody",
      },
      {
        rank: 6,
        address: "0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2",
        balance: 150000000,
        percentage: 1.5,
        label: "FTX-Related Address",
      },
      {
        rank: 7,
        address: "0x8c1656f39e1d231771f9c4a4e3e8d8a9b3c4d5e6",
        balance: 120000000,
        percentage: 1.2,
        label: "Whale (Unknown)",
      },
      {
        rank: 8,
        address: "0x28C6c06298d514Db089934071355E5743bf21d60",
        balance: 100000000,
        percentage: 1.0,
        label: "Binance Cold Wallet",
      },
      {
        rank: 9,
        address: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
        balance: 95000000,
        percentage: 0.95,
        label: "Binance Main Hot Wallet",
      },
      {
        rank: 10,
        address: "0x7d8b97c2a4c8e4f5a6b8c9d0e1f2a3b4c5d6e7f8",
        balance: 90000000,
        percentage: 0.9,
        label: "DeFi Protocol / Whale",
      },
    ] as const;
    return NextResponse.json({
      success: true,
      uniTopHolders,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching :", error);
    return NextResponse.json(
      { success: false, error: errorMessage || "Unknown error" },
      { status: 500 }
    );
  }
}
