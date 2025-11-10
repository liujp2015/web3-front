import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-20 text-center">React Hooks Demo</h1>
      <ul className="flex justify-center items-center flex-col mt-5 text-2xl ">
        <li className="flex flex-col gap-5 text-center">
          <Link
            href="/useState"
            className="inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useState
          </Link>
          <Link
            href="/useReducer"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useReducer
          </Link>
          <Link
            href="/useContext"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useContext
          </Link>
          <Link
            href="/useEffect"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useEffect
          </Link>
          <Link
            href="/useCallback"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useCallback
          </Link>
          <Link
            href="/useMemo"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useMemo
          </Link>
          <Link
            href="/useRef"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useRef
          </Link>
          <Link
            href="/useLayoutEffect"
            className=" inline-block pb-0.5 border-b-2 border-transparent hover:border-blue-500 transition-colors"
          >
            useLayoutEffect
          </Link>
        </li>
      </ul>
    </div>
  );
}
