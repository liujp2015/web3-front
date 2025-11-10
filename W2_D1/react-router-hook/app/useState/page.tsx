"use client";
import { useState } from "react";
function useStateDemo() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <h1 className="text-center text-4xl mt-20 font-bold">useState Demo</h1>
      <div className="flex justify-center items-center flex-col gap-5 mt-5">
        <div className="text-2xl">
          count的值为: <span className=" text-red-600">{count}</span>
        </div>

        <div className="flex justify-between items-center gap-5">
          <button
            className="bg-blue-400 p-3 rounded-md "
            onClick={() => setCount(count + 1)}
          >
            +1
          </button>
          <button
            className="bg-blue-400 p-3 rounded-md "
            onClick={() => setCount(count - 1)}
          >
            -1
          </button>
        </div>
      </div>
    </div>
  );
}

export default useStateDemo;
