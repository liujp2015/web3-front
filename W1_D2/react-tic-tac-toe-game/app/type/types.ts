type symbols = "X" | "O" | null;

// 定义棋盘单元格类型
type Cell = "X" | "O" | null;
// 定义棋盘类型
type Board = Cell[][];

interface BoardProps {
  board: ("X" | "O" | null)[][];
  onclick: (row: number, col: number) => void;
}

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

interface GameState {
  board: Board;
  callParentFunction: boolean;
  x: number | null;
  y: number | null;
}
