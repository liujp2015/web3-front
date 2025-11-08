import { useContext } from "react";
import Grid from "./Grid";
import { AppContext } from "../context/AppContext";

function Board() {
  const { handleClick, board } = useContext(AppContext);
  return (
    <div className="grid  mt-5 p-8 grid-cols-3 gap-1">
      {/* <Grid
        className="border-l-2 border-t-2"
        symbol={board[0][0]}
        onClick={() => handleCellClick(0,0)}
      />
      <Grid
        className="border-t-2"
        symbol={board[0][1]}
        onClick={() => handleCellClick(0, 1)}
      />
      <Grid
        className="border-t-2 border-r-2"
        symbol={board[0][2]}
        onClick={() => handleCellClick(0, 2)}
      />
      <Grid
        className="border-l-2"
        symbol={board[1][0]}
        onClick={() => handleCellClick(1, 0)}
      />
      <Grid symbol={board[1][1]} onClick={() => handleCellClick(1, 1)} />
      <Grid
        className="border-r-2"
        symbol={board[1][2]}
        onClick={() => handleCellClick(1, 2)}
      />
      <Grid
        className="border-l-2 border-b-2"
        symbol={board[2][0]}
        onClick={() => handleCellClick(2, 0)}
      />
      <Grid
        className="border-b-2"
        symbol={board[2][1]}
        onClick={() => handleCellClick(2, 1)}
      />
      <Grid
        className="border-b-2 border-r-2"
        symbol={board[2][2]}
        onClick={() => handleCellClick(2, 2)}
      /> */}

      <Grid
        className="border-l-2 border-t-2"
        symbol={board[0][0]}
        onClick={() => handleClick(true, 0, 0)}
      />
      <Grid
        className="border-t-2"
        symbol={board[0][1]}
        onClick={() => handleClick(true, 0, 1)}
      />
      <Grid
        className="border-t-2 border-r-2"
        symbol={board[0][2]}
        onClick={() => handleClick(true, 0, 2)}
      />
      <Grid
        className="border-l-2"
        symbol={board[1][0]}
        onClick={() => handleClick(true, 1, 0)}
      />
      <Grid symbol={board[1][1]} onClick={() => handleClick(true, 1, 1)} />
      <Grid
        className="border-r-2"
        symbol={board[1][2]}
        onClick={() => handleClick(true, 1, 2)}
      />
      <Grid
        className="border-l-2 border-b-2"
        symbol={board[2][0]}
        onClick={() => handleClick(true, 2, 0)}
      />
      <Grid
        className="border-b-2"
        symbol={board[2][1]}
        onClick={() => handleClick(true, 2, 1)}
      />
      <Grid
        className="border-b-2 border-r-2"
        symbol={board[2][2]}
        onClick={() => handleClick(true, 2, 2)}
      />
    </div>
  );
}

export default Board;
