import BitCoinKChart from "@/components/BitCoinKChart";
import DexTradingChart from "@/components/DexTradingChart";
import TVLChart from "@/components/TVLChart";
import UniswapTopHolderChart from "@/components/uniswapTopHolderChart";

export default async function Home() {
  // 直接在 Server Component 中 fetch 自己的 API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dune-tvl`, {
    next: { revalidate: 3600 }, // 每小时重新验证（ISR）
  });

  const data = await res.json();

  console.log(data.query_result.result.rows);

  const res1 = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dune-dexTrading`,
    {
      next: { revalidate: 3600 }, // 每小时重新验证（ISR）
    }
  );

  const data1 = await res1.json();
  console.log(data1.query_result.result.rows);

  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/mok-erc20TopTen`,
    {
      next: { revalidate: 3600 }, // 每小时重新验证（ISR）
    }
  );

  const data2 = await res2.json();
  console.log(data2.uniTopHolders);

  const res3 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bitcoink`);

  const data3 = await res3.json();
  console.log(data3);

  return (
    <div>
      <TVLChart dailyData={data.query_result.result.rows}></TVLChart>
      <DexTradingChart
        dailyData={data1.query_result.result.rows}
      ></DexTradingChart>
      <UniswapTopHolderChart data={data2.uniTopHolders}></UniswapTopHolderChart>
      <BitCoinKChart times={data3.times} kData={data3.kData}></BitCoinKChart>
    </div>
  );
}
