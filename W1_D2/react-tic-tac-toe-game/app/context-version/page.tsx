"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Board from "../components/Board-context";
import SymbolSelector from "../components/SymbolSelector";

export default function Home() {
  // 状态管理
  const [showSymbolSelector, setShowSymbolSelector] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [computerSymbol, setComputerSymbol] = useState<"X" | "O" | null>(null);
  // const [board, setBoard] = useState<Board>(
  //   Array(3)
  //     .fill(null)
  //     .map(() => Array(3).fill(null))
  // );
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [moves, setMoves] = useState<
    { player: string; row: number; col: number }[]
  >([]);
  const { handleClick, board, callParentFunction, setBoard, x, y } =
    useContext(AppContext);

  // 检查棋盘是否已满
  const isBoardFull = (board: Board): boolean => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) {
          return false;
        }
      }
    }
    return true;
  };
  // 检查是否有获胜者
  const checkWinner = (board: Board, symbol: "X" | "O"): boolean => {
    // 检查行
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === symbol &&
        board[i][1] === symbol &&
        board[i][2] === symbol
      ) {
        return true;
      }
    }

    // 检查列
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j] === symbol &&
        board[1][j] === symbol &&
        board[2][j] === symbol
      ) {
        return true;
      }
    }

    // 检查对角线
    if (
      board[0][0] === symbol &&
      board[1][1] === symbol &&
      board[2][2] === symbol
    ) {
      return true;
    }
    if (
      board[0][2] === symbol &&
      board[1][1] === symbol &&
      board[2][0] === symbol
    ) {
      return true;
    }

    return false;
  };

  // 处理单元格点击
  const handleCellClick = (row: number, col: number) => {
    // 如果游戏未初始化或当前不是玩家回合或单元格已被占用，则不处理
    if (!playerSymbol || currentPlayer !== playerSymbol || board[row][col]) {
      return;
    }

    // 更新棋盘
    const newBoard = [...board];
    newBoard[row][col] = playerSymbol;
    setBoard(newBoard);

    // 记录移动
    const newMoves = [...moves, { player: "玩家", row, col }];
    setMoves(newMoves);

    // 检查游戏是否结束
    if (checkWinner(newBoard, playerSymbol)) {
      setGameStatus("恭喜！你赢了！");
      setCurrentPlayer(null);
      return;
    }

    // 检查是否平局
    if (isBoardFull(newBoard)) {
      setGameStatus("游戏结束，平局！");
      setCurrentPlayer(null);
      return;
    }

    // 切换到电脑回合
    setCurrentPlayer(computerSymbol);
    setGameStatus(`当前轮到: ${computerSymbol}`);

    // 简单的电脑AI（随机选择空格）
    setTimeout(() => {
      const emptyCells: [number, number][] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!newBoard[i][j]) {
            emptyCells.push([i, j]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const [compRow, compCol] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const updatedBoard = [...newBoard];
        updatedBoard[compRow][compCol] = computerSymbol!;
        setBoard(updatedBoard);

        // 记录电脑移动
        setMoves([...newMoves, { player: "电脑", row: compRow, col: compCol }]);

        // 检查电脑是否赢了
        if (checkWinner(updatedBoard, computerSymbol!)) {
          setGameStatus("电脑赢了！再接再厉！");
          setCurrentPlayer(null);
          return;
        }

        // 检查是否平局
        if (isBoardFull(updatedBoard)) {
          setGameStatus("游戏结束，平局！");
          setCurrentPlayer(null);
          return;
        }

        // 切换回玩家回合
        setCurrentPlayer(playerSymbol);
        setGameStatus(`当前轮到: ${playerSymbol}`);
      }
    }, 500);
  };

  useEffect(() => {
    console.log("子组件改变了callParentFunction");
    if (callParentFunction == true) {
      console.log("执行函数");
      console.log("x:", x, "y:", y);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleCellClick(x as number, y as number);
    }
    handleClick(false);
  }, [callParentFunction]);

  // 初始化游戏
  const initializeGame = (symbol: "X" | "O") => {
    const compSymbol = symbol === "X" ? "O" : "X";
    const emptyBoard = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));

    setPlayerSymbol(symbol);
    setComputerSymbol(compSymbol);
    setBoard(emptyBoard);
    // 遵循X先行的规则
    const firstPlayer = "X";
    setCurrentPlayer(firstPlayer);
    setGameStatus(`游戏开始，当前轮到: ${firstPlayer}`);
    setMoves([]);

    // 如果玩家选择O，则电脑（X）先下
    if (symbol === "O") {
      setTimeout(() => {
        const emptyCells: [number, number][] = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (!emptyBoard[i][j]) {
              emptyCells.push([i, j]);
            }
          }
        }

        if (emptyCells.length > 0) {
          const [compRow, compCol] =
            emptyCells[Math.floor(Math.random() * emptyCells.length)];
          const firstMoveBoard = emptyBoard.map((row) => [...row]); // 复制空棋盘
          firstMoveBoard[compRow][compCol] = "X";
          setBoard(firstMoveBoard);

          // 记录电脑的第一步
          setMoves([{ player: "电脑", row: compRow, col: compCol }]);

          // 切换到玩家回合
          setCurrentPlayer(symbol);
          setGameStatus(`当前轮到: ${symbol}`);
        }
      }, 500);
    }
  };

  // 处理游戏开始
  const handleStartGame = () => {
    setShowSymbolSelector(true);
  };

  // 处理符号选择
  const handleSymbolSelect = (symbol: "X" | "O") => {
    setShowSymbolSelector(false);
    initializeGame(symbol);
  };

  return (
    <>
      {/**
       *  background Container
       */}
      <div className="flex justify-center items-center p-8 bg-gray-300 gap-6 min-h-screen">
        {/**
         *  Card Container
         */}
        <div className="bg-white p-6 mx-4 rounded-2xl shadow-8xl">
          <h1 className="text-center text-3xl font-bold	">tic-tac-toe-game</h1>

          {/* 游戏状态显示 */}
          {gameStatus && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold text-blue-600">
                {gameStatus}
              </p>
            </div>
          )}

          <Board></Board>
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleStartGame}
            >
              {playerSymbol ? `重新开始 (当前: ${playerSymbol})` : "开始游戏"}
            </button>
          </div>

          {playerSymbol && (
            <div className="text-center mt-4">
              <p className="text-green-600 font-semibold">
                你选择的符号是: {playerSymbol}
              </p>
              <p className="text-red-600 font-semibold">
                电脑的符号是: {computerSymbol}
              </p>
            </div>
          )}
        </div>

        {/* 操作记录 */}
        <div className="bg-white p-6 rounded-xl shadow-lg w-64 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">操作记录</h2>
          {moves.length === 0 ? (
            <p className="text-gray-500">暂无操作记录</p>
          ) : (
            <ul className="space-y-2">
              {moves.map((move, index) => (
                <li key={index} className="p-2 bg-gray-50 rounded">
                  {`${index + 1}. ${move.player} 在 (${move.row + 1},${
                    move.col + 1
                  }) 位置下了${
                    playerSymbol && move.player === "玩家"
                      ? playerSymbol
                      : computerSymbol
                  }`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 符号选择弹窗 */}
      {showSymbolSelector && (
        <SymbolSelector
          onSelect={handleSymbolSelect}
          onClose={() => setShowSymbolSelector(false)}
        />
      )}
    </>
  );
}
