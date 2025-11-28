'use client'

import Link from "next/link";
import { ConnectButton } from './ConnectButton'

export default function Header() {
  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-2xl text-blue-600 font-bold">
              Web3 DAPP AI
            </Link>
          </div>
          <div className="ml-10 flex items-center justify-center gap-6">
            <Link href="/mint" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Mint
            </Link>
            <Link href="/swap" className="text-gray-600 hover:text-blue-600 transition-colors">
              Swap
            </Link>
            <Link href="/pool" className="text-gray-600 hover:text-blue-600 transition-colors">
              Pool
            </Link>
            <Link href="/farm" className="text-gray-600 hover:text-blue-600 transition-colors">
              Farms
            </Link>
            <Link href="/launchpad" className="text-gray-600 hover:text-blue-600 transition-colors">
              LaunchPad
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/bridge" className="text-gray-600 hover:text-blue-600 transition-colors">
              Bridge
            </Link>
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-200"></div>
    </div>
  );
}