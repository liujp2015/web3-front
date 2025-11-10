"use client";
import { useLayoutEffect, useRef, useState } from "react";

export default function Page() {
  const divRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  });
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-4xl mt-20 font-bold">
        useLayoutEffect Demo
      </h1>
      <div
        ref={divRef}
        className="h-[200px] w-[300px] bg-blue-400 rounded-lg mt-4 text-white text-center leading-[200px]"
      >
        div的宽度为:{width}px
      </div>
    </div>
  );
}
