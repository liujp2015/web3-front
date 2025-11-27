"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTokenMint } from "@/hooks/useTokenMint";
import { useLaunchPad, useLaunchPadData } from "@/hooks/useLaunchPad";
import { useTokenApprove } from "@/hooks/useTokenApprove";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { getTokenAddress, getProtocolAddress } from "@/lib/constants";
import { parseUnits } from "viem";
import { sepolia } from "wagmi/chains";
import ApproveButton from "@/components/ApproveButton";

export default function LaunchPadPage() {
  const { address, isConnected } = useAccount();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [showMintForm, setShowMintForm] = useState(false);
  const [showMintTokenAForm, setShowMintTokenAForm] = useState(false);
  const [showMintTokenBForm, setShowMintTokenBForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mintAmount, setMintAmount] = useState("");
  const [mintTokenAAmount, setMintTokenAAmount] = useState("");
  const [mintTokenBAmount, setMintTokenBAmount] = useState("");
  const projectsPerPage = 6;

  const usdcAddress = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as
    | `0x${string}`
    | undefined;
  const tokenAAddress = getTokenAddress(sepolia.id, 'TKA') as `0x${string}` | undefined;
  const tokenBAddress = getTokenAddress(sepolia.id, 'TKB') as `0x${string}` | undefined;
  const launchpadAddress = getProtocolAddress(sepolia.id, 'LAUNCHPAD') as `0x${string}` | undefined;
  const { balance: usdcBalance } = useTokenBalance(usdcAddress, address);
  const { balance: tokenABalance } = useTokenBalance(tokenAAddress, address);
  const { balance: tokenBBalance } = useTokenBalance(tokenBAddress, address);

  const {
    mint,
    isPending: isMinting,
    isSuccess: isMintSuccess,
  } = useTokenMint();
  const {
    investInProject,
    isPending: isProjectPending,
    isSuccess: isProjectSuccess,
  } = useLaunchPad();
  const {
    approve,
    isPending: isApproving,
    isSuccess: isApproveSuccess,
  } = useTokenApprove();

  useEffect(() => {
    if (isMintSuccess) {
      console.log("✅ Mint successful!");
      alert(
        "Token Mint successful! Please wait a few seconds for balance to update."
      );
      setMintAmount("");
      setMintTokenAAmount("");
      setMintTokenBAmount("");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isMintSuccess, isProjectSuccess]);

  const [projects, setProjects] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch("/api/launchpad/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleMintUSDC = async () => {
    if (!usdcAddress || !mintAmount) {
      console.error("Missing params:", { usdcAddress, mintAmount });
      return;
    }
    console.log("Minting USDC:", { usdcAddress, mintAmount, address });
    try {
      await mint(usdcAddress, mintAmount, 18);
    } catch (error) {
      console.error("Mint failed:", error);
      alert(
        `Mint failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleMintTokenA = async () => {
    if (!tokenAAddress || !mintTokenAAmount) {
      console.error("Missing params:", { tokenAAddress, mintTokenAAmount });
      return;
    }
    console.log("Minting TokenA:", { tokenAAddress, mintTokenAAmount, address });
    try {
      await mint(tokenAAddress, mintTokenAAmount, 18);
    } catch (error) {
      console.error("Mint failed:", error);
      alert(
        `Mint failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleMintTokenB = async () => {
    if (!tokenBAddress || !mintTokenBAmount) {
      console.error("Missing params:", { tokenBAddress, mintTokenBAmount });
      return;
    }
    console.log("Minting TokenB:", { tokenBAddress, mintTokenBAmount, address });
    try {
      await mint(tokenBAddress, mintTokenBAmount, 18);
    } catch (error) {
      console.error("Mint failed:", error);
      alert(
        `Mint failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleInvest = async () => {
    if (!selectedProject || !investAmount) return;
    try {
      await investInProject(selectedProject.id, investAmount);
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  const mockProjects = projects?.projects || [];

  const totalPages = Math.ceil(mockProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = mockProjects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: "bg-green-100 text-green-600 border-green-200",
      completed: "bg-gray-100 text-gray-600 border-gray-200",
      upcoming: "bg-blue-100 text-blue-600 border-blue-200",
    };
    return badges[status] || badges.upcoming;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🚀</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LaunchPad</h1>
          <p className="text-gray-600 text-lg">
            Discover and invest in promising blockchain projects
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8 border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowMintForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <span className="text-lg">💰</span>
                <span className="hidden sm:inline">Mint USDC</span>
              </button>

              <button
                onClick={() => setShowMintTokenAForm(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <span className="text-lg">🪙</span>
                <span className="hidden sm:inline">Mint TKA</span>
              </button>

              <button
                onClick={() => setShowMintTokenBForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <span className="text-lg">🎯</span>
                <span className="hidden sm:inline">Mint TKB</span>
              </button>

              {isConnected && (
                <a
                  href="/launchpad/create"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span className="text-lg">🚀</span>
                  <span className="hidden sm:inline">Create</span>
                </a>
              )}
            </div>

            {/* Right: Balance Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-2.5 border border-blue-200">
                <span className="text-2xl">💎</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">USDC</span>
                  <span className="text-lg font-bold text-gray-900">
                    {parseFloat(usdcBalance || "0").toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl px-4 py-2.5 border border-orange-200">
                <span className="text-2xl">🪙</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">TKA</span>
                  <span className="text-lg font-bold text-gray-900">
                    {parseFloat(tokenABalance || "0").toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl px-4 py-2.5 border border-cyan-200">
                <span className="text-2xl">🎯</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">TKB</span>
                  <span className="text-lg font-bold text-gray-900">
                    {parseFloat(tokenBBalance || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentProjects.map((project: any) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex justify-between">
                {/* 项目标题区 */}
                <div className="flex items-center mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {project.symbol}
                    </h3>
                  </div>
                </div>
                {/* 顶部: 状态标签 */}
                <div className="flex justify-end mb-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                      project.status
                    )}`}
                  >
                    {project.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900 font-semibold">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Raised</div>
                  <div className="text-gray-900 font-semibold text-sm truncate">
                    ${project.raised}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Goal</div>
                  <div className="text-gray-900 font-semibold text-sm truncate">
                    ${project.totalRaise}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Token Price</div>
                  <div className="text-gray-900 font-semibold text-sm truncate">
                    ${project.tokenPrice}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Participants</div>
                  <div className="text-gray-900 font-semibold text-sm truncate">
                    {project.participants}
                  </div>
                </div>
              </div>

              {project.status === "active" ? (
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Invest Now
                </button>
              ) : project.status === "upcoming" ? (
                <button className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed">
                  Coming Soon
                </button>
              ) : (
                <button className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed">
                  Sale Ended
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm mb-8">
          Showing {startIndex + 1}-
          {Math.min(startIndex + projectsPerPage, mockProjects.length)} of{" "}
          {mockProjects.length} projects
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {selectedProject.symbol}
                    </h2>
                    <div className="text-gray-500 text-sm">
                      {selectedProject.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                {selectedProject.description}
              </p>

              {selectedProject.status === "active" && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <label className="text-gray-600 text-sm mb-2 block">
                    Investment Amount (USDC)
                  </label>
                  <div className="flex items-center bg-white rounded-lg px-4 py-3 mb-4 border border-gray-200">
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-gray-900 text-xl font-semibold focus:outline-none placeholder-gray-400"
                    />
                    <button className="text-blue-500 text-sm font-semibold hover:text-blue-600">
                      MAX
                    </button>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>You will receive:</span>
                    <span className="text-gray-900 font-semibold">
                      {investAmount
                        ? (
                            parseFloat(investAmount) /
                            parseFloat(selectedProject.tokenPrice)
                          ).toFixed(2)
                        : "0.00"}{" "}
                      {selectedProject.symbol}
                    </span>
                  </div>

                  <ApproveButton
                    tokenAddress={usdcAddress}
                    spenderAddress={launchpadAddress}
                    amount={investAmount ? parseUnits(investAmount, 18) : BigInt(0)}
                    tokenSymbol="USDC"
                    disabled={
                      isProjectPending ||
                      !investAmount ||
                      parseFloat(investAmount) <= 0
                    }
                  >
                    <button
                      onClick={handleInvest}
                      disabled={
                        isProjectPending ||
                        !investAmount ||
                        parseFloat(investAmount) <= 0
                      }
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                    >
                      {isProjectPending ? "Investing..." : "Confirm Investment"}
                    </button>
                  </ApproveButton>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-gray-900 font-semibold mb-4">Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="text-gray-900">
                      {selectedProject.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="text-gray-900">
                      {selectedProject.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        selectedProject.status === "active"
                          ? "text-green-600"
                          : selectedProject.status === "completed"
                          ? "text-gray-600"
                          : "text-blue-600"
                      }`}
                    >
                      {selectedProject.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Free Mint USDC Modal */}
        {showMintForm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowMintForm(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🪙 Free Mint USDC
                </h2>
                <button
                  onClick={() => setShowMintForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Connect your wallet to mint USDC
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl cursor-not-allowed"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">
                      Amount to Mint
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">
                          Current Balance:{" "}
                          {parseFloat(usdcBalance || "0").toFixed(2)} USDC
                        </span>
                      </div>
                      <input
                        type="number"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent text-gray-900 text-2xl font-semibold focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      🎁 Free USDC for testing! Mint up to 1,000 USDC per
                      transaction.
                    </p>
                  </div>

                  <button
                    onClick={handleMintUSDC}
                    disabled={
                      isMinting ||
                      !mintAmount ||
                      parseFloat(mintAmount) <= 0 ||
                      parseFloat(mintAmount) > 1000
                    }
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    {isMinting ? "Minting..." : "Mint USDC"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Free Mint TokenA Modal */}
        {showMintTokenAForm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowMintTokenAForm(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🪙 Free Mint TokenA
                </h2>
                <button
                  onClick={() => setShowMintTokenAForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Connect your wallet to mint TokenA
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl cursor-not-allowed"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">
                      Amount to Mint
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">
                          Current Balance:{" "}
                          {parseFloat(tokenABalance || "0").toFixed(2)} TKA
                        </span>
                      </div>
                      <input
                        type="number"
                        value={mintTokenAAmount}
                        onChange={(e) => setMintTokenAAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent text-gray-900 text-2xl font-semibold focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <p className="text-orange-800 text-sm">
                      🎁 Free TokenA for testing! Mint up to 1,000 TKA per
                      transaction.
                    </p>
                  </div>

                  <button
                    onClick={handleMintTokenA}
                    disabled={
                      isMinting ||
                      !mintTokenAAmount ||
                      parseFloat(mintTokenAAmount) <= 0 ||
                      parseFloat(mintTokenAAmount) > 1000
                    }
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    {isMinting ? "Minting..." : "Mint TokenA"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Free Mint TokenB Modal */}
        {showMintTokenBForm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowMintTokenBForm(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🎯 Free Mint TokenB
                </h2>
                <button
                  onClick={() => setShowMintTokenBForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Connect your wallet to mint TokenB
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl cursor-not-allowed"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">
                      Amount to Mint
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">
                          Current Balance:{" "}
                          {parseFloat(tokenBBalance || "0").toFixed(2)} TKB
                        </span>
                      </div>
                      <input
                        type="number"
                        value={mintTokenBAmount}
                        onChange={(e) => setMintTokenBAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent text-gray-900 text-2xl font-semibold focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
                    <p className="text-cyan-800 text-sm">
                      🎁 Free TokenB for testing! Mint up to 1,000 TKB per
                      transaction.
                    </p>
                  </div>

                  <button
                    onClick={handleMintTokenB}
                    disabled={
                      isMinting ||
                      !mintTokenBAmount ||
                      parseFloat(mintTokenBAmount) <= 0 ||
                      parseFloat(mintTokenBAmount) > 1000
                    }
                    className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    {isMinting ? "Minting..." : "Mint TokenB"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
