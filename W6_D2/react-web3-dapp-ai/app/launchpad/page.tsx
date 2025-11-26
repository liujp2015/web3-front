'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokenMint } from '@/hooks/useTokenMint'
import { useLaunchPad, useLaunchPadData } from '@/hooks/useLaunchPad'
import { useTokenApprove } from '@/hooks/useTokenApprove'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { getTokenAddress } from '@/lib/constants'
import { sepolia } from 'wagmi/chains'

export default function LaunchPadPage() {
  const { address, isConnected } = useAccount()
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [investAmount, setInvestAmount] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showMintForm, setShowMintForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [mintAmount, setMintAmount] = useState('')
  const projectsPerPage = 6
  
  // Create Project Form State
  const [projectForm, setProjectForm] = useState({
    name: '',
    symbol: '',
    targetAmount: '',
    pricePerToken: '',
    duration: '30',
    description: ''
  })

  const usdcAddress = getTokenAddress(sepolia.id, 'USDC') as `0x${string}` | undefined
  const { balance: usdcBalance } = useTokenBalance(usdcAddress, address)
  
  const { mint, isPending: isMinting, isSuccess: isMintSuccess } = useTokenMint()
  const { createProject, investInProject, isPending: isProjectPending, isSuccess: isProjectSuccess } = useLaunchPad()
  const { approve, isPending: isApproving, isSuccess: isApproveSuccess } = useTokenApprove()
  
  useEffect(() => {
    if (isMintSuccess) {
      setMintAmount('')
      setShowMintForm(false)
    }
    if (isProjectSuccess) {
      setProjectForm({ name: '', symbol: '', targetAmount: '', pricePerToken: '', duration: '30', description: '' })
      setShowCreateForm(false)
    }
  }, [isMintSuccess, isProjectSuccess])

  const mockProjects = [
    {
      id: 1,
      name: 'DeFi Protocol X',
      symbol: 'DPX',
      logo: '🚀',
      description: 'Next-generation decentralized lending protocol with AI-powered risk assessment',
      totalRaise: '500,000',
      raised: '350,000',
      participants: 1234,
      startTime: '2024-02-15',
      endTime: '2024-02-28',
      tokenPrice: '0.05',
      status: 'active',
      progress: 70
    },
    {
      id: 2,
      name: 'GameFi Arena',
      symbol: 'GFA',
      logo: '🎮',
      description: 'Play-to-earn metaverse gaming platform with NFT integration',
      totalRaise: '1,000,000',
      raised: '1,000,000',
      participants: 3456,
      startTime: '2024-01-20',
      endTime: '2024-02-05',
      tokenPrice: '0.10',
      status: 'completed',
      progress: 100
    },
    {
      id: 3,
      name: 'Green Energy DAO',
      symbol: 'GED',
      logo: '🌱',
      description: 'Decentralized renewable energy financing and carbon credit marketplace',
      totalRaise: '750,000',
      raised: '125,000',
      participants: 567,
      startTime: '2024-03-01',
      endTime: '2024-03-15',
      tokenPrice: '0.08',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 4,
      name: 'AI Trading Bot',
      symbol: 'ATB',
      logo: '🤖',
      description: 'Autonomous trading bot powered by machine learning algorithms',
      totalRaise: '300,000',
      raised: '180,000',
      participants: 890,
      startTime: '2024-02-20',
      endTime: '2024-03-05',
      tokenPrice: '0.03',
      status: 'active',
      progress: 60
    },
    {
      id: 5,
      name: 'NFT Marketplace',
      symbol: 'NFTM',
      logo: '🎨',
      description: 'Decentralized marketplace for digital art and collectibles',
      totalRaise: '800,000',
      raised: '600,000',
      participants: 2100,
      startTime: '2024-02-10',
      endTime: '2024-02-25',
      tokenPrice: '0.12',
      status: 'active',
      progress: 75
    },
    {
      id: 6,
      name: 'Cross-Chain Bridge',
      symbol: 'CCB',
      logo: '🌉',
      description: 'Secure and fast cross-chain asset transfer protocol',
      totalRaise: '1,200,000',
      raised: '0',
      participants: 0,
      startTime: '2024-03-10',
      endTime: '2024-03-25',
      tokenPrice: '0.15',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 7,
      name: 'DAO Governance',
      symbol: 'DAO',
      logo: '🏛️',
      description: 'Decentralized governance platform for community-driven decision making',
      totalRaise: '600,000',
      raised: '420,000',
      participants: 1567,
      startTime: '2024-01-25',
      endTime: '2024-02-10',
      tokenPrice: '0.07',
      status: 'active',
      progress: 70
    },
    {
      id: 8,
      name: 'Metaverse Land',
      symbol: 'LAND',
      logo: '🏞️',
      description: 'Virtual real estate platform in the decentralized metaverse',
      totalRaise: '2,000,000',
      raised: '1,500,000',
      participants: 4500,
      startTime: '2024-01-15',
      endTime: '2024-01-30',
      tokenPrice: '0.20',
      status: 'completed',
      progress: 100
    },
    {
      id: 9,
      name: 'Privacy Coin',
      symbol: 'PRIV',
      logo: '🔐',
      description: 'Next-generation privacy-focused cryptocurrency with advanced encryption',
      totalRaise: '900,000',
      raised: '270,000',
      participants: 780,
      startTime: '2024-03-05',
      endTime: '2024-03-20',
      tokenPrice: '0.09',
      status: 'upcoming',
      progress: 0
    }
  ]

  const handleMintUSDC = async () => {
    if (!usdcAddress || !mintAmount) return
    try {
      await mint(usdcAddress, mintAmount, 18)
    } catch (error) {
      console.error('Mint failed:', error)
    }
  }

  const handleCreateProject = async () => {
    if (!projectForm.name || !projectForm.symbol || !projectForm.targetAmount || !projectForm.pricePerToken) return
    try {
      await createProject(
        projectForm.name,
        projectForm.symbol,
        projectForm.targetAmount,
        projectForm.pricePerToken,
        parseInt(projectForm.duration),
        projectForm.description
      )
    } catch (error) {
      console.error('Create project failed:', error)
    }
  }

  const handleInvest = async () => {
    if (!selectedProject || !investAmount) return
    try {
      await investInProject(selectedProject.id, investAmount)
    } catch (error) {
      console.error('Investment failed:', error)
    }
  }

  // Pagination Logic
  const totalPages = Math.ceil(mockProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const currentProjects = mockProjects.slice(startIndex, startIndex + projectsPerPage)

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'bg-green-100 text-green-600 border-green-200',
      completed: 'bg-gray-100 text-gray-600 border-gray-200',
      upcoming: 'bg-blue-100 text-blue-600 border-blue-200'
    }
    return badges[status] || badges.upcoming
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 LaunchPad
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and invest in promising blockchain projects
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button 
            onClick={() => setShowMintForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            💰 Free Mint USDC
          </button>
          
          {isConnected && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              ➕ Create Project
            </button>
          )}
          
          <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 flex items-center gap-2">
            <span className="text-gray-600 text-sm">USDC Balance:</span>
            <span className="text-gray-900 font-semibold">{parseFloat(usdcBalance || '0').toFixed(2)}</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-4xl mr-3">{project.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <div className="text-gray-500 text-sm">${project.symbol}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(project.status)}`}>
                  {project.status.toUpperCase()}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900 font-semibold">{project.progress}%</span>
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
                  <div className="text-gray-900 font-semibold">${project.raised}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Goal</div>
                  <div className="text-gray-900 font-semibold">${project.totalRaise}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Token Price</div>
                  <div className="text-gray-900 font-semibold">${project.tokenPrice}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Participants</div>
                  <div className="text-gray-900 font-semibold">{project.participants}</div>
                </div>
              </div>

              {project.status === 'active' ? (
                <button 
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Invest Now
                </button>
              ) : project.status === 'upcoming' ? (
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
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm mb-8">
          Showing {startIndex + 1}-{Math.min(startIndex + projectsPerPage, mockProjects.length)} of {mockProjects.length} projects
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setSelectedProject(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full border border-gray-200"
                 onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="text-5xl mr-4">{selectedProject.logo}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedProject.name}</h2>
                    <div className="text-gray-500">${selectedProject.symbol}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedProject.description}</p>

              {selectedProject.status === 'active' && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <label className="text-gray-600 text-sm mb-2 block">Investment Amount (USDC)</label>
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
                      {investAmount ? (parseFloat(investAmount) / parseFloat(selectedProject.tokenPrice)).toFixed(2) : '0.00'} {selectedProject.symbol}
                    </span>
                  </div>

                  <button 
                    onClick={handleInvest}
                    disabled={isProjectPending || !investAmount || parseFloat(investAmount) <= 0}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    {isProjectPending ? 'Investing...' : 'Confirm Investment'}
                  </button>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-gray-900 font-semibold mb-4">Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="text-gray-900">{selectedProject.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="text-gray-900">{selectedProject.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      selectedProject.status === 'active' ? 'text-green-600' :
                      selectedProject.status === 'completed' ? 'text-gray-600' :
                      'text-blue-600'
                    }`}>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setShowMintForm(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200"
                 onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🪙 Free Mint USDC</h2>
                <button
                  onClick={() => setShowMintForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Connect your wallet to mint USDC</p>
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
                    <label className="text-gray-600 text-sm mb-2 block">Amount to Mint</label>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">Current Balance: {parseFloat(usdcBalance || '0').toFixed(2)} USDC</span>
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
                      🎁 Free USDC for testing! Mint up to 1,000 USDC per transaction.
                    </p>
                  </div>

                  <button 
                    onClick={handleMintUSDC}
                    disabled={isMinting || !mintAmount || parseFloat(mintAmount) <= 0 || parseFloat(mintAmount) > 1000}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    {isMinting ? 'Minting...' : 'Mint USDC'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setShowCreateForm(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🚀 Create New Project</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm mb-2 block">Project Name</label>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                      placeholder="My Amazing Project"
                      className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm mb-2 block">Token Symbol</label>
                    <input
                      type="text"
                      value={projectForm.symbol}
                      onChange={(e) => setProjectForm({...projectForm, symbol: e.target.value.toUpperCase()})}
                      placeholder="MAP"
                      className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm mb-2 block">Target Amount (USDC)</label>
                    <input
                      type="number"
                      value={projectForm.targetAmount}
                      onChange={(e) => setProjectForm({...projectForm, targetAmount: e.target.value})}
                      placeholder="100000"
                      className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm mb-2 block">Price per Token (USDC)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={projectForm.pricePerToken}
                      onChange={(e) => setProjectForm({...projectForm, pricePerToken: e.target.value})}
                      placeholder="0.10"
                      className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm mb-2 block">Sale Duration (days)</label>
                  <select
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm({...projectForm, duration: e.target.value})}
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-600 text-sm mb-2 block">Project Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    placeholder="Describe your project, its goals, and what makes it unique..."
                    rows={4}
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-900 font-semibold mb-2">Project Summary</h4>
                  <div className="text-blue-800 text-sm space-y-1">
                    <div>Total Tokens: {projectForm.targetAmount && projectForm.pricePerToken ? (parseFloat(projectForm.targetAmount) / parseFloat(projectForm.pricePerToken || '1')).toLocaleString() : '0'}</div>
                    <div>Duration: {projectForm.duration} days</div>
                    <div>Market Cap: ${projectForm.targetAmount || '0'} USDC</div>
                  </div>
                </div>

                <button 
                  onClick={handleCreateProject}
                  disabled={isProjectPending || !projectForm.name || !projectForm.symbol || !projectForm.targetAmount || !projectForm.pricePerToken}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all"
                >
                  {isProjectPending ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}