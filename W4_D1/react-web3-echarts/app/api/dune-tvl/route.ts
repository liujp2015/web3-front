// 必须命名为 route.ts
import { NextResponse } from "next/server";
import { DuneClient } from "@duneanalytics/client-sdk";

export async function GET() {
  try {
    const dune = new DuneClient(process.env.DUNE_API_KEY!);
    const query_result = await dune.getLatestResult({ queryId: 2996103 });

    return NextResponse.json({
      success: true,
      query_result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching Dune TVL:", error);
    return NextResponse.json(
      { success: false, error: errorMessage || "Unknown error" },
      { status: 500 }
    );
  }
}
