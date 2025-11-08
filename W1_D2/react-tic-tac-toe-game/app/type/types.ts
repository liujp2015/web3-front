type symbols = "X" | "O" | null;

// 定义棋盘单元格类型
type Cell = "X" | "O" | null;
// 定义棋盘类型
type Board = Cell[][];

interface BoardProps {
  board: ("X" | "O" | null)[][];
  onclick: (row: number, col: number) => void;
}
