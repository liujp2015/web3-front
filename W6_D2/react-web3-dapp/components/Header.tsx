import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="flex justify-start items-center">
          <div>
            <Link href="/" className="text-2xl text-blue-600 font-bold">
              DeFi DApp
            </Link>
          </div>
          <div className="ml-10 flex items-center justify-center gap-4">
            <Link href={"/farm"} className="text-gray-500">
              farm
            </Link>
            <Link href={"/pool"} className="text-gray-500">
              pool
            </Link>
            <Link href={"/swap"} className="text-gray-500">
              swap
            </Link>
          </div>
          <div>{/* <ConnectButton></ConnectButton> */}</div>
        </div>
      </div>
      <div className="h-px bg-gray-200"></div>
    </div>
  );
}
