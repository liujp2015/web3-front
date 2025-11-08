"use client"; // 👈 必须加这一行！

import { createContext } from "react";

interface AppContextType {
  // playerSymbol: symbols;
  // computerSymbol: symbols;
  handleClick: (
    callParentFunction: boolean,
    x?: number | null,
    y?: number | null
  ) => void;
  board: Board;
  callParentFunction: boolean;
  setBoard: React.Dispatch<React.SetStateAction<Board>>; // 👈 新增
  x: number | null;
  y: number | null;
}

export const AppContext = createContext<AppContextType>({
  handleClick: () => {},
  board: [],
  callParentFunction: false,
  setBoard: () => {}, // 默认空函数
  x: null,
  y: null,
});
