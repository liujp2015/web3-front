"use client";
import SimpleModal from "@/components/SimpleModal";
import { useState } from "react";

export default function Page() {
  const [openSlippage, setOpenSlippage] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="p-5 rounded-xl shadow-gray-600  shadow-md">
        <div className="flex items-center justify-between">
          <h1 className=" font-bold text-2xl">Swap</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-settings-icon lucide-settings"
            onClick={() => setOpenSlippage(!openSlippage)}
          >
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        {/* <div className="flex flex-col p-3 bg-gray-50 rounded-xl w-100 gap-3 relative "> */}
        <div className="flex flex-col p-3 bg-gray-50 rounded-xl w-100 gap-3 mt-4 ">
          <div className="flex items-center justify-between">
            <span className="text-left">From</span>
            <span className="text-right">Max</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              className="w-full h-12 text-3xl outline-none"
              type="number"
            />

            {/* <select className="bg-white h-10 p-1 rounded-md ml-3 shadow-xs shadow-gray-300 focus:outline-none font-bold absolute right-[-1rem]"> */}
            <select className="bg-white h-10 p-1 rounded-md ml-3 shadow-xs shadow-gray-300 focus:outline-none font-bold mr-[-2rem]">
              <option>ETH</option>
              <option>USDC</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="p-2 bg-white hover:bg-gray-50 rounded-md mt-1 cursor-pointer border-gray-50 border-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-up-down-icon lucide-arrow-up-down"
            >
              <path d="m21 16-4 4-4-4" />
              <path d="M17 20V4" />
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col p-3 bg-gray-50 rounded-xl w-100 gap-3 ">
          <div className="flex items-center justify-between">
            <span className="text-left">To</span>
            {/* <span className="text-right">Max</span> */}
          </div>
          <div className="flex items-center justify-between">
            <input
              className="w-full h-12 text-3xl outline-none"
              type="number"
            />

            {/* <select className="bg-white h-10 p-1 rounded-md ml-3 shadow-xs shadow-gray-300 focus:outline-none font-bold absolute right-[-1rem]"> */}
            <select className="bg-white h-10 p-1 rounded-md ml-3 shadow-xs shadow-gray-300 focus:outline-none font-bold mr-[-2rem]">
              <option>ETH</option>
              <option>USDC</option>
            </select>
          </div>
        </div>
        <div>
          <button className="p-3 text-md font-bold bg-gray-400 text-white rounded-md w-full">
            Swap
          </button>
        </div>
      </div>
      <div className="bg-gray-50 p-3 mt-5 w-110">
        <h1 className="font-bold text-md">How it works</h1>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Select tokens to swap</li>
          <li>Enter amount and get instant quote</li>
          <li>Approve token spending (one-time)</li>
          <li>Confirm swap transaction</li>
        </ul>
      </div>
      <SimpleModal
        isOpen={openSlippage}
        onClose={() => {
          setOpenSlippage(false);
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="">Settings</div>
            <div className="font-bold text-xl">X</div>
          </div>
          <p>Slippage Tolerance</p>
          <div className="flex mt-2">
            <div className="flex-1 text-center bg-gray-100 p-3 rounded-lg m-1 hover:bg-gray-200 active:bg-red-500 cursor-pointer ">
              123
            </div>
            <div className="flex-1 text-center bg-gray-100 p-3 rounded-lg m-1 hover:bg-gray-200 ">
              123
            </div>
            <div className="flex-1 text-center bg-gray-100 p-3 rounded-lg m-1 hover:bg-gray-200 ">
              123
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <input
              className="w-full p-3 rounded-lg border-gray-200 border-2 outline-blue-500"
              type="number"
            ></input>
            <span className="-ml-4 text-md text-gray-600">%</span>
          </div>
          <div className="bg-gray-200 h-px my-2"></div>
          <div className="bg-blue-100 text-gray-600 p-2">
            <h1 className="font-bold">What is slippage?</h1>
            <p className="text-sm">
              Slippage is the difference between expected and actual trade
              price. Your transaction will revert if the price changes
              unfavorably by more than this percentage.
            </p>
          </div>
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
            Done
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}
