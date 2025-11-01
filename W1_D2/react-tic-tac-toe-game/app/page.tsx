import Grid from "./components/Grid";

export default function Home() {
  return (
    // background Container
    <div className="flex justify-center items-center h-screen ">
      {/**
       *  Card Container
       */}
      <div className="bg-gray-500 p-4 mx-6 rounded-2xl shadow-8xl">
        <h1 className="text-center text-3xl font-bold	">tic-tac-toe-game</h1>
        <div className="grid  mt-5 p-12 grid-cols-3">
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
        </div>
      </div>
    </div>
  );
}
