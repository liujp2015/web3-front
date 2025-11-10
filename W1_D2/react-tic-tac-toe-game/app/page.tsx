import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col ">
      <h1 className="text-4xl mt-28 p-5 rounded-lg text-black bg-white font-bold">
        react井字游戏
      </h1>
      <div className="flex flex-col gap-4 mt-5 text-2xl ">
        <button className=" border p-5 rounded-lg hover:text-white hover:bg-blue-400 text-black bg-white">
          <Link href="/component-version">父子组件版</Link>
        </button>
        <button className=" border p-5 rounded-lg hover:text-white hover:bg-blue-400 text-black bg-white">
          <Link href="/context-version">上下文context版</Link>
        </button>
        <button className=" border p-5 rounded-lg hover:text-white hover:bg-blue-400 text-black bg-white">
          <Link href="/redux-version">redux版</Link>
        </button>
      </div>
    </div>
  );
}
