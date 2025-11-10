"use client";
import { useReducer } from "react";

type CounterAction = { type: "increment" | "decrement" };
interface CounterState {
  count: number;
}
const initialState: CounterState = { count: 0 };
function counterReducer(state: CounterState, action: CounterAction) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
function Page() {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  return (
    <div>
      <h1 className="text-center text-4xl mt-20 font-bold">useReducer Demo</h1>
      <div className="flex justify-center items-center flex-col gap-5 mt-5">
        <div className="text-2xl">
          count的值为: <span className=" text-red-600">{state.count}</span>
        </div>

        <div className="flex justify-between items-center gap-5">
          <button
            className="bg-blue-400 p-3 rounded-md "
            onClick={() => dispatch({ type: "increment" })}
          >
            +1
          </button>
          <button
            className="bg-blue-400 p-3 rounded-md "
            onClick={() => dispatch({ type: "decrement" })}
          >
            -1
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
