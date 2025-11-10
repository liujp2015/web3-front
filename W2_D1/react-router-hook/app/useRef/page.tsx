"use client";
import { useEffect, useRef, useState } from "react";
/* eslint-disable react-hooks/refs */

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);

  const countRef = useRef(0);
  const [render, setRender] = useState<number>(0);

  const focusInput = () => {
    inputRef.current?.focus();
  };
  const incrementCountRef = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };
  useEffect(() => {
    console.log("组件渲染");
  });
  return (
    <div>
      <h1 className="text-center text-4xl mt-20 font-bold">useRef Demo</h1>
      <div className="flex flex-col items-center mt-5">
        <div className="flex flex-col items-center ">
          <input ref={inputRef} className="border" />
          <br />
          <button
            onClick={focusInput}
            className="border px-4 py-1 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
          >
            点击聚焦input
          </button>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <p className="text-2xl">countRef计数:{countRef.current}</p>
          <button
            onClick={incrementCountRef}
            className="border px-4 py-1 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
          >
            countRef+1
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="text-2xl">渲染次数:{render}</p>
          <button
            onClick={() => {
              setRender(render + 1);
            }}
            className="border px-4 py-1 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
          >
            渲染组件
          </button>
        </div>
      </div>
    </div>
  );
}
