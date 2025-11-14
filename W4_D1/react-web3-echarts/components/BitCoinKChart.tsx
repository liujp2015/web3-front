"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
// 定义数据类型
type KDataItem = [number, number, number, number]; // [open, close, low, high]
type TimeItem = string; // 如 '2023-01-01'

interface KChartProps {
  times: TimeItem[];
  kData: KDataItem[];
}

const KChart: React.FC<KChartProps> = ({ times, kData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current!);

    const option: echarts.EChartsOption = {
      title: {
        text: "BitCoin K Chart",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "category",
        data: times,
        boundaryGap: false,
      },
      yAxis: {
        scale: true,
      },
      series: [
        {
          type: "candlestick",
          data: kData,
          itemStyle: {
            color: "#ec0000", // 阳线（涨）
            color0: "#00da3c", // 阴线（跌）
            borderColor: "#ec0000",
            borderColor0: "#00da3c",
          },
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
  }, [kData, times]);

  return <div ref={chartRef} style={{ width: "100%", height: "450px" }} />;
};
export default KChart;
