"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface RawDataItem {
  _col1: string;
  project: string;
  usd_volume: number;
}

export default function DexTradingChart({
  dailyData,
}: {
  dailyData: RawDataItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dailyData || dailyData.length === 0) return;

    // ✅ 新增：过滤掉 Balancer 在 2025-11-12 的异常数据
    const cleanedData = dailyData.filter((item) => {
      const date = item._col1.split(" ")[0];
      if (item.project.toLowerCase() === "balancer" && date === "2025-11-12") {
        return false;
      }
      return true;
    });

    if (cleanedData.length === 0) return;

    // Step 1: 按日期 + 项目聚合交易量
    const aggregated: Record<string, Record<string, number>> = {};
    cleanedData.forEach((item) => {
      const date = item._col1.split(" ")[0];
      const { project, usd_volume } = item;
      if (!aggregated[date]) aggregated[date] = {};
      aggregated[date][project] = (aggregated[date][project] || 0) + usd_volume;
    });

    // Step 2: 为每天生成 Top15 项目，并记录 Others 的值（仅用于 tooltip）
    const top15Data: Record<string, { project: string; usd_volume: number }[]> =
      {};
    const othersMap: Record<string, number> = {}; // 存储每天的 Others 数值

    Object.keys(aggregated).forEach((date) => {
      const records = Object.entries(aggregated[date]).map(
        ([project, vol]) => ({
          project,
          usd_volume: vol,
        })
      );
      records.sort((a, b) => b.usd_volume - a.usd_volume);

      const top15 = records.slice(0, 15);
      const othersSum = records
        .slice(15)
        .reduce((sum, r) => sum + r.usd_volume, 0);

      top15Data[date] = top15;
      othersMap[date] = othersSum; // 即使为 0 也记录
    });

    // Step 3: 提取日期和 Top15 中的所有唯一项目（不含 Others）
    const dateList = Object.keys(top15Data).sort();
    const allProjects = new Set<string>();
    Object.values(top15Data).forEach((records) => {
      records.forEach((r) => allProjects.add(r.project));
    });
    // 计算每个项目的总交易量（跨所有日期）
    const projectTotal: Record<string, number> = {};
    Object.values(top15Data).forEach((records) => {
      records.forEach((r) => {
        projectTotal[r.project] = (projectTotal[r.project] || 0) + r.usd_volume;
      });
    });

    const projectList = Array.from(allProjects).sort(
      (a, b) => (projectTotal[a] || 0) - (projectTotal[b] || 0)
    ); // 升序：小项目在前，大项目在后 → 大项目在顶部 ✅

    // Step 4: 构建 series（只包含真实项目，不含 Others）
    const series = projectList.map((project) => ({
      name: project,
      type: "bar",
      stack: "total",
      data: dateList.map((date) => {
        const record = top15Data[date].find((r) => r.project === project);
        return record ? record.usd_volume : 0;
      }),
    }));

    // Step 5: 初始化 ECharts
    const myChart = echarts.init(chartRef.current!);

    const option = {
      title: {
        text: "每日 Top 15 交易所交易量（堆叠柱状图）",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const validParams = params.filter((p) => p.value > 0);
          validParams.sort((a, b) => b.value - a.value);

          const date = validParams[0]?.name || "";
          const othersValue = othersMap[date] || 0;

          let total = othersValue;
          let tip = `<b>${date}</b><br/>`;
          validParams.forEach((p) => {
            tip += `${p.marker} ${p.seriesName}: $${Number(
              p.value
            ).toLocaleString(undefined, { maximumFractionDigits: 2 })}<br/>`;
            total += p.value;
          });

          // 只有当 Others > 0 时才显示
          if (othersValue > 0) {
            tip += `<b> Others: $${othersValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}</b><br/>`;
          }

          tip += `<b>Total: $${total.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}</b>`;
          return tip;
        },
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "middle",
        type: "scroll",
        height: "80%",
      },
      xAxis: {
        type: "category",
        data: dateList,
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "value",
        name: "USD Volume",
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
            if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
            if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
            return `$${value}`;
          },
        },
      },
      series,
      grid: {
        left: 60,
        right: 200,
        top: 80,
        bottom: 80,
      },
    };

    myChart.setOption(option);

    const handleResize = () => myChart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [dailyData]);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
}
