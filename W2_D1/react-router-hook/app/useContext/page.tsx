"use client";
import clsx from "clsx";
import { createContext, useContext, useState } from "react";

type theme = "light" | "dark";

const ThemeContext = createContext<theme>("light");

function Child() {
  const theme = useContext(ThemeContext);
  return (
    <div className="flex justify-center mt-5">
      当前颜色是: <span>{theme}</span>
    </div>
  );
}
export default function Page() {
  const [theme, setTheme] = useState<theme>("light");

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={clsx(
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        )}
      >
        <h1 className="text-center text-4xl mt-20 font-bold">
          useContext Demo
        </h1>
        <div className="flex justify-center gap-5 mt-5">
          <button
            onClick={() => setTheme("dark")}
            className={clsx(
              theme === "dark" ? "bg-white text-black" : "bg-black text-white",
              "p-2 rounded-md transition-transform hover:scale-110"
            )}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={clsx(
              theme === "dark" ? "bg-white text-black" : "bg-black text-white",
              "p-2 rounded-md transition-transform hover:scale-110"
            )}
          >
            Light
          </button>
        </div>
        <Child />
      </div>
    </ThemeContext.Provider>
  );
}
