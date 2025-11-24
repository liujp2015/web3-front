"use client";
import { useState } from "react";
import clsx from "clsx"; // Import clsx

export default function Page() {
  const [activeTab, setActiveTab] = useState("add");
  return (
    <div className="h-screen ">
      <div className="flex flex-col items-center justify-center ">
        <div className="p-10">
          <h1 className="text-3xl font-bold">Liquidity Pool</h1>
          <p className="text-gray-600 mt-4">
            Add or remove liquidity to earn trading fees
          </p>
          <div className="flex  gap-4 mt-4">
            <div className="flex-1 rounded-lg bg-blue-500 min-w-0 p-4 px-6">
              <div className="text-gray-200">Total TVL</div>
              <div className="text-white font-bold text-2xl mb-6 mr-10">
                $1,250,000
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-green-500 min-w-0 p-4 px-6">
              <div>Reserve A</div>
              <div className="text-white font-bold text-2xl  mr-10">
                2662.08
              </div>
              <div className="text-white font-bold text-2xl ">TKA</div>
            </div>
            <div className="flex-1 rounded-lg bg-purple-500 min-w-0 p-6 px-8">
              <div>Reserve B</div>
              <div className="text-white font-bold text-2xl  mr-10">
                3516.89
              </div>
              <div className="text-white font-bold text-2xl ">TKB</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl shadow-gray-600  shadow-md p-8 mt-10 ">
          <div className="flex gap-2">
            <button
              className={clsx(
                "flex-1  min-w-0  px-18 p-2  whitespace-nowrap rounded-md  font-bold   text-gray-700",
                activeTab === "add"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-300"
              )}
              onClick={() => setActiveTab("add")}
            >
              Add Liquidity
            </button>
            <button
              className={clsx(
                "flex-1 min-w-0 px-18 p-2  whitespace-nowrap rounded-md  font-bold  text-gray-700",
                activeTab === "remove"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-300"
              )}
              onClick={() => setActiveTab("remove")}
            >
              Remove Liquidity
            </button>
          </div>

          <div className="bg-gray-100 p-3 mt-6 rounded-xl">
            <div className="flex justify-between text-sm ">
              <span className="text-gray-700">LP Tokens</span>
              <span className="text-blue-700">Balance: 0</span>
            </div>
            <div className="flex justify-between items-center ">
              <input
                className="text-2xl font-bold p-2 mt-2 w-full outline-none"
                placeholder="0.0"
                type="number"
              />
              <div className="bg-white p-2  rounded-md border-gray-300 border text-black font-bold mt-1 ">
                TKA
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-3">
            <div className="p-2 bg-white hover:bg-gray-50 rounded-md mt-1 cursor-pointer border-gray-50 border-4">
              {activeTab === "add" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-plus-icon lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-move-down-icon lucide-move-down"
                >
                  <path d="M8 18L12 22L16 18" />
                  <path d="M12 2V22" />
                </svg>
              )}
            </div>
          </div>

          {activeTab === "add" ? (
            <div className="bg-gray-100 p-3 rounded-xl">
              <div className="flex justify-between text-sm ">
                <span className="text-gray-700">LP Tokens</span>
                <span className="text-blue-700">Balance: 0</span>
              </div>
              <div className="flex justify-between items-center ">
                <input
                  className="text-2xl font-bold p-2 mt-2 w-full outline-none"
                  placeholder="0.0"
                  type="number"
                />
                <div className="bg-white p-2  rounded-md border-gray-300 border text-black font-bold mt-1 ">
                  TKB
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 p-2 rounded-xl mb-3">
                <div className="flex justify-between text-sm ">
                  <span className="text-gray-700">LP Tokens</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-black text-xl font-bold">0 TKA</div>
                </div>
              </div>
              <div className="bg-gray-100 p-2 rounded-xl">
                <div className="flex justify-between text-sm ">
                  <span className="text-gray-700">LP Tokens</span>
                </div>
                <div className="flex justify-between items-center ">
                  <div className="text-black text-xl font-bold">0 TKB</div>
                </div>
              </div>
            </>
          )}

          <div className="mt-6">
            <button className="p-3 text-md font-bold bg-gray-400 text-white rounded-md w-full">
              {activeTab === "add" ? "Add Liquidity" : "Remove Liquidity"}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-3 mt-5 w-150 rounded-xl">
          <h1 className="font-bold text-md">How it works</h1>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Add liquidity in a 1:1 ratio to earn trading fees</li>
            <li>Receive LP tokens representing your pool share</li>
            <li>Remove liquidity anytime by burning LP tokens</li>
            <li>Earn 0.3% fee on all swaps proportional to your share</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
