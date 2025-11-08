"use client"; // 👈 必须加这一行！

import { createContext } from "react";

export const AppContext = createContext<AppContextType>({
  handleClick: () => {},
  board: [],
  callParentFunction: false,
  setBoard: () => {}, // 默认空函数
  x: null,
  y: null,
});
