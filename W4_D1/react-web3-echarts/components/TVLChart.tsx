"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function TVLChart({
  dailyData,
}: {
  dailyData: { time: string; eth_tvl: number }[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !dailyData?.length) return;
    const sortedData = [...dailyData].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    ); // 升序
    // 准备 ECharts 数据
    const seriesData = sortedData
      .map((item) => [new Date(item.time).getTime(), Number(item.eth_tvl)])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    const myChart = echarts.init(chartRef.current);
    const displayedYears = new Set<number>();

    const option = {
      title: {
        text: "ETH TVL",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const param = params[0];
          const date = new Date(param.value[0]);
          const valueInK = param.value[1] / 1000;
          const formattedValue = new Intl.NumberFormat().format(valueInK);
          return `${
            date.toISOString().split("T")[0]
          }<br/>TVL: $${formattedValue}K`;
        },
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value: string) => {
            const year = new Date(value).getFullYear();
            if (!displayedYears.has(year)) {
              displayedYears.add(year);
              return year.toString();
            }
            return "";
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => {
            const valueInK = value / 1000;
            return `$${new Intl.NumberFormat().format(valueInK)}K`;
          },
        },
      },
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "none",
          data: seriesData,
        },
      ],
    };

    myChart.setOption(option);

    const handleResize = () => {
      displayedYears.clear();
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [dailyData]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}
