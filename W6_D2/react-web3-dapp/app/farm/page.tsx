export default function Page() {
  return (
    <div className="h-screen">
      <div className="flex flex-col items-center justify-center ">
        <div className="p-10">
          <h1 className="text-3xl font-bold">Farm</h1>
          <p className="text-gray-600 mt-4">
            Stake LP tokens to earn DRT rewards
          </p>
          <div className="flex  gap-4 mt-6">
            <div className="flex-1 rounded-lg bg-green-500  w-140 p-6 flex flex-col justify-center">
              <div className="text-gray-200">Total Value Locked</div>
              <div className="text-white font-bold text-4xl">$5.50M</div>
            </div>
            <div className="flex-1 rounded-lg bg-blue-500 p-4 flex flex-col justify-center">
              <div className="text-gray-200">Active Farms</div>
              <div className="text-white font-bold text-4xl ">3</div>
            </div>
            <div className="flex-1 rounded-lg bg-purple-500  p-4 flex flex-col justify-center">
              <div className="text-gray-200"> Active Users</div>
              <div className="text-white font-bold text-4xl  ">1,247</div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold mt-10">Available Pools</h1>
          </div>
          <div className="rounded-xl shadow-gray-600  shadow-md p-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl">TKA-TKB LP Farm</div>
              <div className="bg-green-400 rounded-2xl">125.50% APY</div>
            </div>
            <div className="text-sm">TKA-TKB LP</div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 bg-gray-100 p-4 rounded-md">
                <p>TVL</p>
                <p>$3.20M</p>
              </div>
              <div className="flex-1 bg-gray-100 p-4 rounded-md">
                <p>Your Staked</p>
                <p>0 LP</p>
              </div>
              <div className="flex-1 bg-blue-100 p-4 rounded-md">
                <p>LP Balance</p>
                <p>0 LP</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-amber-50 p-4 mt-4 rounded-xl border-2 border-amber-100">
              <div>
                <p>Pending Rewards</p>
                <p>0 DRT</p>
              </div>
              <div>
                <button>Harvest</button>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-px my-4 "></div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <button className="bg-gray-200  font-bold text-center w-full rounded-xl p-2">
                Deposit
              </button>
              <button className="bg-blue-600 text-white font-bold text-center w-full rounded-xl p-2">
                Withdraw
              </button>
            </div>

            <div className="bg-gray-50 p-3 mt-6 rounded-xl">
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
                  LP
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="p-3 text-md font-bold bg-gray-400 text-white rounded-md w-full">
                Deposit
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-3 mt-5 w-150 rounded-xl">
            <h1 className="font-bold text-md">How Farming Works</h1>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Deposit LP tokens to start earning DRT rewards</li>
              <li>Rewards are calculated based on your share of the pool</li>
              <li>Harvest rewards at any time without unstaking</li>
              <li>Withdraw your LP tokens anytime (rewards auto-harvest)</li>
              <li>Higher APY pools may have higher risk or lower liquidity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
