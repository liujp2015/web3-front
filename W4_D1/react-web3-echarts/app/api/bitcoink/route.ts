import { generateMockKData } from "@/utils/mockKData";
import { NextResponse } from "next/server";

export async function GET() {
  const { times, kData } = generateMockKData(100); // 生成 100 条

  return NextResponse.json({
    success: true,
    times,
    kData,
  });
}
