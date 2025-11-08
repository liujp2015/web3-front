import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: GameState = {
  board: Array(3)
    .fill(null)
    .map(() => Array(3).fill(null)),
  callParentFunction: false,
  x: null,
  y: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Cell[][]>) => {
      state.board = action.payload;
    },
    setCallParentFunction: (state, action: PayloadAction<boolean>) => {
      state.callParentFunction = action.payload;
    },
    setX: (state, action: PayloadAction<number>) => {
      state.x = action.payload;
    },
    setY: (state, action: PayloadAction<number>) => {
      state.y = action.payload;
    },
  },
});

export const { setBoard, setCallParentFunction, setX, setY } =
  gameSlice.actions;
export default gameSlice.reducer;
