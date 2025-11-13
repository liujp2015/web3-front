// 必须命名为 route.ts
import { NextResponse } from "next/server";
import { DuneClient } from "@duneanalytics/client-sdk";

// 如果你只是读取公开查询，其实不需要 Dune SDK 和 API Key！
// 公开查询可以直接通过 Dune 的公开 API 获取

export async function GET() {
  try {
    const dune = new DuneClient(process.env.DUNE_API_KEY!);
    const query_result = await dune.getLatestResult({ queryId: 4388 });
    return NextResponse.json({
      success: true,
      query_result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching Dune DexTrading:", error);
    return NextResponse.json(
      { success: false, error: errorMessage || "Unknown error" },
      { status: 500 }
    );
  }
}
