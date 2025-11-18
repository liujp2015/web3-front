export default function Page() {
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
            <button className="flex-1  min-w-0  px-18 p-2  whitespace-nowrap rounded-md  font-bold hover:bg-gray-300 bg-gray-200 text-gray-700">
              Add Liquidity
            </button>
            <button className="flex-1 min-w-0 px-18 p-2  whitespace-nowrap rounded-md  font-bold hover:bg-gray-300 bg-gray-200 text-gray-700">
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
          <div className="mt-6">
            <button className="p-3 text-md font-bold bg-gray-400 text-white rounded-md w-full">
              Approve liquidity
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
