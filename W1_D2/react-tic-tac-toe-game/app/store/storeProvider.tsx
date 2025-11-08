// store/storeProvider.tsx
"use client"; // 如果用于 App Router

import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./index";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // 在客户端首次渲染时创建 store
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
