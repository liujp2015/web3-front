// utils/mockKData.ts

export function generateMockKData(count = 100) {
  const now = new Date();
  const basePrice = 60000; // 起始价格
  let currentPrice = basePrice;

  const times: string[] = [];
  const kData: [number, number, number, number][] = [];

  // 从最早时间开始生成（倒序生成再反转，或正序）
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // 每小时一根

    // 格式化时间为 "YYYY-MM-DD HH:mm"
    const timeStr = time.toISOString().slice(0, 16).replace("T", " ");

    // 模拟价格波动
    const changePercent = (Math.random() - 0.5) * 0.02; // ±2%
    const open = currentPrice;
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);

    currentPrice = close;

    times.push(timeStr);
    kData.push([open, close, low, high]); // ECharts 要求顺序：[open, close, low, high]
  }

  return { times, kData };
}
