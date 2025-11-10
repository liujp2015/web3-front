"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [count, setCount] = useState<number>(0);
  const [title, setTitle] = useState<string>("useEffect演示");
  useEffect(() => {
    document.title = `计数: ${count}`;
  }, [count]);
  useEffect(() => {
    console.log("组件挂载");
    return () => console.log("组件卸载");
  }, []);
  return (
    <div>
      <h1 className="text-center text-4xl mt-20 font-bold">useEffect Demo</h1>
      <div className="flex justify-center items-center flex-col gap-5">
        <h2 className="mt-5">{title}</h2>
        <p>计数:{count}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCount(count + 1)}
        >
          +1
        </button>
      </div>
    </div>
  );
}
