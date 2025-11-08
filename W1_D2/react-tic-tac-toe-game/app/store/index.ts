// store/index.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice";

// 创建 store 的工厂函数
export const makeStore = () => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
  });
};

// 类型定义
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
