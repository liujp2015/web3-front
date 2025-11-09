import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>react井字游戏</h1>
      <Link href="/component-version">父子组件版</Link>
      <Link href="/context-version">上下文context版</Link>
      <Link href="/redux-version">redux版</Link>
    </div>
  );
}
