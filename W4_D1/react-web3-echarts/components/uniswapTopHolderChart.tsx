"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface RawDataItem {
  address: string;
  balance: number;
}

export default function UniswapTopHolderChart({
  data,
}: {
  data: RawDataItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current!);

    const option = {
      title: {
        text: "Uniswap Top Holder",
        left: "center",
      },
      series: [
        {
          type: "pie",
          radius: "60%", // 可选：让饼图更美观
          label: {
            show: true,
            formatter: "{b}: {d}%", // {b}=name, {d}=percentage
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} UNI ({d}%)",
          },
          data: data.map((item) => ({
            value: item.balance,
            name: item.address,
          })),
        },
      ],
    };

    myChart.setOption(option);

    const handleResize = () => myChart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
}
