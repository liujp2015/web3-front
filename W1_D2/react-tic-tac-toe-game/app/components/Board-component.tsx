import Grid from "./Grid";

function Board({ board, onclick }: BoardProps) {
  return (
    <div className="grid  mt-5 p-8 grid-cols-3 gap-1">
      <Grid
        className="border-l-2 border-t-2"
        symbol={board[0][0]}
        onClick={() => onclick(0, 0)}
      />
      <Grid
        className="border-t-2"
        symbol={board[0][1]}
        onClick={() => onclick(0, 1)}
      />
      <Grid
        className="border-t-2 border-r-2"
        symbol={board[0][2]}
        onClick={() => onclick(0, 2)}
      />
      <Grid
        className="border-l-2"
        symbol={board[1][0]}
        onClick={() => onclick(1, 0)}
      />
      <Grid symbol={board[1][1]} onClick={() => onclick(1, 1)} />
      <Grid
        className="border-r-2"
        symbol={board[1][2]}
        onClick={() => onclick(1, 2)}
      />
      <Grid
        className="border-l-2 border-b-2"
        symbol={board[2][0]}
        onClick={() => onclick(2, 0)}
      />
      <Grid
        className="border-b-2"
        symbol={board[2][1]}
        onClick={() => onclick(2, 1)}
      />
      <Grid
        className="border-b-2 border-r-2"
        symbol={board[2][2]}
        onClick={() => onclick(2, 2)}
      />
    </div>
  );
}

export default Board;
