"use client";
import { memo, useCallback, useState } from "react";

interface ChildProps {
  onClick: () => void;
  message: string;
  className?: string;
}

const Child = memo(function Child({ onClick, message, className }: ChildProps) {
  console.log("Child 渲染了!", { onClick, message }); // 👈 关键：放这里！
  return (
    <div className={className} onClick={onClick}>
      {message}
    </div>
  );
});
export default function Page() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const handleCount = useCallback(() => {
    setCount((prev) => prev + 1);
    console.log("useCallback的组件");
  }, []);
  const handleText = () => {
    setText("no useCallback");
    console.log("no useCallback的组件");
  };

  return (
    <div>
      <h1 className="text-center text-4xl mt-20 font-bold">useCallback Demo</h1>
      <div className="flex justify-center items-center flex-col gap-5 mt-5">
        <div className="text-2xl">
          <p>计数:{count}</p>
          <p>文本:{text}</p>
        </div>
        <div className="flex gap-2">
          <Child
            onClick={handleCount}
            message="使用了useCallback"
            className="border px-4 py-2 rounded-lg bg-blue-400 text-white"
          ></Child>
          <Child
            onClick={handleText}
            message="没有使用useCallback"
            className="border px-4 py-2 rounded-lg bg-blue-400 text-white"
          ></Child>
        </div>
      </div>
    </div>
  );
}
