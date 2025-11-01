import Grid from "./components/Grid";

export default function Home() {
  return (
    // background Container
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {/**
       *  Card Container
       */}
      <div className="bg-gray-100 p-4 mx-6 rounded-2xl shadow-8xl">
        <h1 className="text-center text-3xl font-bold	">tic-tac-toe-game</h1>
        <div className="grid  mt-5 p-12 grid-cols-3">
          <Grid className=" border-l-2 border-t-2"></Grid>
          <Grid className="border-t-2"></Grid>
          <Grid className="border-t-2 border-r-2"></Grid>
          <Grid className="border-l-2"></Grid>
          <Grid></Grid>
          <Grid className="border-r-2"></Grid>
          <Grid className="border-l-2 border-b-2"></Grid>
          <Grid className="border-b-2"></Grid>
          <Grid className="border-b-2 border-r-2"></Grid>
        </div>
      </div>
    </div>
  );
}
