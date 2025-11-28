"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useLaunchPad } from "@/hooks/useLaunchPad";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { getProtocolAddress } from "@/lib/constants";
import { parseUnits } from "viem";
import { sepolia } from "wagmi/chains";
import ApproveButton from "@/components/ApproveButton";

export default function LaunchPadPage() {
  const { address, isConnected } = useAccount();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const usdcAddress = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as
    | `0x${string}`
    | undefined;
  const launchpadAddress = getProtocolAddress(sepolia.id, 'LAUNCHPAD') as `0x${string}` | undefined;
  const { balance: usdcBalance } = useTokenBalance(usdcAddress, address);

  const {
    investInProject,
    isPending: isProjectPending,
    isSuccess: isProjectSuccess,
  } = useLaunchPad();

  const [projects, setProjects] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading amazing projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-700 border-gray-200",
      upcoming: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return badges[status] || badges.upcoming;
  };

  // 格式化金额为M单位
  const formatAmountInMillions = (amount: string | number): string => {
    const numAmount = parseFloat(amount.toString() || '0');
    if (numAmount >= 1000000) {
      return `$${(numAmount / 1000000).toFixed(2)}M`;
    } else if (numAmount >= 1000) {
      return `$${(numAmount / 1000).toFixed(1)}K`;
    } else {
      return `$${numAmount.toFixed(0)}`;
    }
  };

  // 格式化进度为3位小数
  const formatProgress = (progress: number): string => {
    return progress.toFixed(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="text-4xl lg:text-6xl mb-3 lg:mb-4 animate-bounce">🚀</div>
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 lg:mb-4">LaunchPad</h1>
          <p className="text-gray-700 text-base lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Discover and invest in the most promising blockchain projects
          </p>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-4 lg:p-6 text-white">
            <div className="text-xs lg:text-sm opacity-90 mb-1 font-medium">Total Projects</div>
            <div className="text-2xl lg:text-3xl font-bold">{mockProjects.length}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-4 lg:p-6 text-white">
            <div className="text-xs lg:text-sm opacity-90 mb-1 font-medium">Active</div>
            <div className="text-2xl lg:text-3xl font-bold">
              {mockProjects.filter((p: any) => p.status === 'active').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-4 lg:p-6 text-white">
            <div className="text-xs lg:text-sm opacity-90 mb-1 font-medium">Completed</div>
            <div className="text-2xl lg:text-3xl font-bold">
              {mockProjects.filter((p: any) => p.status === 'completed').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-4 lg:p-6 text-white">
            <div className="text-xs lg:text-sm opacity-90 mb-1 font-medium">Total Raised</div>
            <div className="text-lg lg:text-2xl font-bold">
              {formatAmountInMillions(
                mockProjects.reduce((sum: number, p: any) => sum + parseFloat(p.raised || '0'), 0)
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-4 lg:p-6 mb-6 lg:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
              <a
                href="/mint"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-4 lg:px-6 py-3 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-xl lg:text-2xl">🪙</span>
                <span>Mint Tokens</span>
              </a>

              {isConnected && (
                <a
                  href="/launchpad/create"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-4 lg:px-6 py-3 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="text-xl lg:text-2xl">✨</span>
                  <span>Create Project</span>
                </a>
              )}
            </div>

            {/* Right: Balance Display */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-indigo-200/50">
                <span className="text-2xl lg:text-3xl">💎</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 font-medium">BALANCE</span>
                  <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${parseFloat(usdcBalance || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {currentProjects.map((project: any) => (
            <div
              key={project.id}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 lg:p-10 shadow-xl border border-white/30 hover:border-purple-300/50 transition-all cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl group min-h-[400px]"
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Header with Status */}
              <div className="flex items-start justify-between mb-4 lg:mb-6">
                <div className="flex items-center min-w-0 flex-1">
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 truncate">
                      {project.name || project.symbol}
                    </h3>
                    <div className="text-gray-500 text-sm font-medium">
                      ${project.symbol}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(
                    project.status
                  )} shadow-lg flex-shrink-0 ml-2`}
                >
                  {project.status}
                </div>
              </div>

              {/* Project Description */}
              <p className="text-gray-600 text-sm mb-4 lg:mb-6 line-clamp-2 leading-relaxed">
                {project.description || 'A promising blockchain project with innovative solutions.'}
              </p>

              {/* Progress Bar */}
              <div className="mb-4 lg:mb-6">
                <div className="flex justify-between text-sm mb-2 lg:mb-3">
                  <span className="text-gray-600 font-medium">Funding Progress</span>
                  <span className="text-gray-900 font-bold">
                    {formatProgress(project.progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 lg:h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 lg:p-5 border border-blue-100">
                  <div className="text-blue-600 text-xs font-semibold mb-2 uppercase tracking-wider">Goal</div>
                  <div className="text-gray-900 font-bold text-base lg:text-xl break-words">
                    {formatAmountInMillions(project.goal || project.totalRaise || '0')}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 lg:p-5 border border-green-100">
                  <div className="text-green-600 text-xs font-semibold mb-2 uppercase tracking-wider">Raised</div>
                  <div className="text-gray-900 font-bold text-base lg:text-xl break-words">
                    {formatAmountInMillions(project.raised || '0')}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 lg:p-5 border border-purple-100">
                  <div className="text-purple-600 text-xs font-semibold mb-2 uppercase tracking-wider">Price</div>
                  <div className="text-gray-900 font-bold text-base lg:text-xl break-words">
                    ${parseFloat(project.price || project.tokenPrice || '0').toFixed(4)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 lg:p-5 border border-orange-100">
                  <div className="text-orange-600 text-xs font-semibold mb-2 uppercase tracking-wider">Investors</div>
                  <div className="text-gray-900 font-bold text-base lg:text-xl break-words">
                    {project.participants || 0}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {project.status === "active" ? (
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🚀 Invest Now
                </button>
              ) : project.status === "upcoming" ? (
                <button className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white/70 font-bold py-4 rounded-2xl cursor-not-allowed">
                  ⏳ Coming Soon
                </button>
              ) : (
                <button className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white/70 font-bold py-4 rounded-2xl cursor-not-allowed">
                  ✅ Sale Ended
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
            className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-600 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                  currentPage === page
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl"
                    : "bg-white/80 text-gray-600 hover:bg-white/90 border border-white/30"
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
            className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-600 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            Next
          </button>
        </div>

        <div className="text-center text-gray-600 text-sm mb-8">
          Showing {startIndex + 1}-
          {Math.min(startIndex + projectsPerPage, mockProjects.length)} of{" "}
          {mockProjects.length} projects
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white/95 backdrop-blur-lg rounded-3xl p-4 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4 lg:mb-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {selectedProject.name || selectedProject.symbol}
                  </h2>
                  <div className="text-gray-600 text-base lg:text-lg font-medium">
                    ${selectedProject.symbol}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl lg:text-3xl p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-4 lg:mb-6 text-base lg:text-lg leading-relaxed">
                {selectedProject.description || 'A revolutionary blockchain project bringing innovative solutions to the decentralized ecosystem.'}
              </p>

              {selectedProject.status === "active" && (
                <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 border border-purple-100/50">
                  <label className="text-gray-700 text-sm font-semibold mb-3 block">
                    Investment Amount (USDC)
                  </label>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-3 lg:px-4 py-3 lg:py-4 mb-4 border border-gray-200 shadow-sm">
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-gray-900 text-lg lg:text-xl font-semibold focus:outline-none placeholder-gray-400"
                    />
                    <button 
                      onClick={() => setInvestAmount(usdcBalance || '0')}
                      className="text-purple-600 text-sm font-bold hover:text-purple-700 px-2 lg:px-3 py-1 rounded-lg hover:bg-purple-50 transition-all"
                    >
                      MAX
                    </button>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4 lg:mb-6 p-3 bg-white/50 rounded-lg">
                    <span className="font-medium">You will receive:</span>
                    <span className="text-gray-900 font-bold">
                      {investAmount
                        ? (
                            parseFloat(investAmount) /
                            parseFloat(selectedProject.price || selectedProject.tokenPrice || '1')
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
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 lg:py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {isProjectPending ? "🔄 Investing..." : "🚀 Confirm Investment"}
                    </button>
                  </ApproveButton>
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-100/50">
                <h3 className="text-gray-900 font-bold text-base lg:text-lg mb-4 flex items-center gap-2">
                  📅 Project Timeline
                </h3>
                <div className="space-y-3 lg:space-y-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                    <span className="text-gray-600 font-medium">Start Date:</span>
                    <span className="text-gray-900 font-semibold">
                      {new Date(selectedProject.startTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                    <span className="text-gray-600 font-medium">End Date:</span>
                    <span className="text-gray-900 font-semibold">
                      {new Date(selectedProject.endTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                        selectedProject.status === "active"
                          ? "bg-green-100 text-green-700"
                          : selectedProject.status === "completed"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}