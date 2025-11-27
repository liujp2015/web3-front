const { createPublicClient, http } = require('viem')
const { sepolia } = require('viem/chains')

const USDC_ADDRESS = '0x2d6bf73e7c3c48ce8459468604fd52303a543dcd'

const client = createPublicClient({
  chain: sepolia,
  transport: http('https://sepolia.infura.io/v3/da2de9befd37454aa8dc594c122102f1')
})

async function checkContract() {
  try {
    // 检查合约代码
    const code = await client.getBytecode({ address: USDC_ADDRESS })
    console.log('合约存在:', code && code.length > 2)
    
    // 尝试读取 name 和 symbol
    const nameAbi = [{
      "inputs": [],
      "name": "name",
      "outputs": [{"type": "string"}],
      "stateMutability": "view",
      "type": "function"
    }]
    
    const symbolAbi = [{
      "inputs": [],
      "name": "symbol",
      "outputs": [{"type": "string"}],
      "stateMutability": "view",
      "type": "function"
    }]
    
    try {
      const name = await client.readContract({
        address: USDC_ADDRESS,
        abi: nameAbi,
        functionName: 'name'
      })
      console.log('代币名称:', name)
    } catch (e) {
      console.log('读取 name 失败:', e.message)
    }
    
    try {
      const symbol = await client.readContract({
        address: USDC_ADDRESS,
        abi: symbolAbi,
        functionName: 'symbol'
      })
      console.log('代币符号:', symbol)
    } catch (e) {
      console.log('读取 symbol 失败:', e.message)
    }
    
  } catch (error) {
    console.error('错误:', error)
  }
}

checkContract()
