/**
 * LaunchPad V2 代币发行合约 ABI
 */
export const LAUNCHPAD_ABI = [
  {
    name: 'createProject',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_name', type: 'string', internalType: 'string' },
      { name: '_symbol', type: 'string', internalType: 'string' },
      { name: '_targetAmount', type: 'uint256', internalType: 'uint256' },
      { name: '_pricePerToken', type: 'uint256', internalType: 'uint256' },
      { name: '_duration', type: 'uint256', internalType: 'uint256' },
      { name: '_description', type: 'string', internalType: 'string' }
    ],
    outputs: []
  },
  {
    name: 'invest',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_projectId', type: 'uint256', internalType: 'uint256' },
      { name: '_amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'projects',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [
      { name: 'creator', type: 'address', internalType: 'address' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'symbol', type: 'string', internalType: 'string' },
      { name: 'targetAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'raisedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'pricePerToken', type: 'uint256', internalType: 'uint256' },
      { name: 'endTime', type: 'uint256', internalType: 'uint256' },
      { name: 'description', type: 'string', internalType: 'string' },
      { name: 'active', type: 'bool', internalType: 'bool' }
    ]
  },
  {
    name: 'projectCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'uint256', internalType: 'uint256' }
    ]
  },
  {
    name: 'buy',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_saleId', type: 'uint256', internalType: 'uint256' },
      { name: '_amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'claim',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_saleId', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'getUserInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: '_saleId', type: 'uint256', internalType: 'uint256' },
      { name: '_user', type: 'address', internalType: 'address' }
    ],
    outputs: [
      { name: 'purchasedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'claimedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'claimableAmount', type: 'uint256', internalType: 'uint256' }
    ]
  },
  {
    name: 'getSaleInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: '_saleId', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [
      { name: 'creator', type: 'address', internalType: 'address' },
      { name: 'saleToken', type: 'address', internalType: 'address' },
      { name: 'paymentToken', type: 'address', internalType: 'address' },
      { name: 'price', type: 'uint256', internalType: 'uint256' },
      { name: 'totalAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'soldAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'startTime', type: 'uint256', internalType: 'uint256' },
      { name: 'endTime', type: 'uint256', internalType: 'uint256' },
      { name: 'minPurchase', type: 'uint256', internalType: 'uint256' },
      { name: 'maxPurchase', type: 'uint256', internalType: 'uint256' },
      { name: 'finalized', type: 'bool', internalType: 'bool' },
      { name: 'active', type: 'bool', internalType: 'bool' }
    ]
  },
  {
    name: 'getSaleCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'uint256', internalType: 'uint256' }
    ]
  },
  {
    name: 'finalize',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_saleId', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: []
  }
]
