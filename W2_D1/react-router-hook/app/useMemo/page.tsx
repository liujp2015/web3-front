"use client";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [countUseMemo, setCountUseMemo] = useState<number>(0);
  const [countNoUseMemo, setCountNoUseMemo] = useState<number>(0);
  const useMemoCount = useMemo(() => {
    console.log("useMemo执行");
    return countUseMemo * 100;
  }, [countUseMemo]);

  const noUseMemoCount = countNoUseMemo * 100;
  useEffect(() => {
    console.log("组件渲染");
  });
  return (
    <div>
      <h1 className="text-center text-4xl mt-20 font-bold">useMemo Demo</h1>
      <div className="flex flex-col items-center">
        <div className="flex  items-center flex-col gap-5 mt-5">
          <p>计数1:{useMemoCount}</p>
          <p>计数2:{noUseMemoCount}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setCountUseMemo(countUseMemo + 1)}
            className="border px-4 py-2 rounded-lg bg-blue-400 text-white"
          >
            使用了useMemo的count+1
          </button>
          <button
            onClick={() => setCountNoUseMemo(countNoUseMemo + 1)}
            className="border px-4 py-2 rounded-lg bg-blue-400 text-white"
          >
            没有使用useMemo的count+1
          </button>
        </div>
      </div>
    </div>
  );
}
