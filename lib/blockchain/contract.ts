export interface LandNFT {
  tokenId: string
  owner: string
  farmId: string
  area: number
  location: {
    lat: number
    lng: number
  }
  metadata: {
    soilType: string
    cropHistory: string[]
    certifications: string[]
  }
}

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  type: "sale" | "lease" | "insurance" | "subsidy"
  timestamp: number
  status: "pending" | "confirmed" | "failed"
}

export class BlockchainService {
  private contractAddress: string
  private provider: any
  private isConnected: boolean = false

  constructor() {
    this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""
  }

  private async getProvider() {
    if (typeof window === "undefined") {
      throw new Error("Window object not available")
    }

    if (!(window as any).ethereum) {
      throw new Error("MetaMask not installed")
    }

    return (window as any).ethereum
  }

  async connectWallet(): Promise<string | null> {
    try {
      const provider = await this.getProvider()
      
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      })
      
      if (accounts.length > 0) {
        this.isConnected = true
        return accounts[0]
      }
      
      return null
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      this.isConnected = false
      return null
    }
  }

  async getWalletAddress(): Promise<string | null> {
    try {
      const provider = await this.getProvider()
      
      const accounts = await provider.request({
        method: "eth_accounts",
      })
      
      return accounts.length > 0 ? accounts[0] : null
    } catch (error) {
      console.error("Failed to get wallet address:", error)
      return null
    }
  }

  async switchToSepoliaNetwork(): Promise<boolean> {
    try {
      const provider = await this.getProvider()
      
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet
      })
      
      return true
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'SepoliaETH',
                decimals: 18
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          })
          return true
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError)
          return false
        }
      }
      
      console.error("Failed to switch to Sepolia network:", error)
      return false
    }
  }

  async mintLandNFT(farmId: string, area: number, location: { lat: number; lng: number }): Promise<string | null> {
    try {
      if (!this.isConnected) {
        throw new Error("Wallet not connected")
      }

      const provider = await this.getProvider()
      const accounts = await provider.request({ method: "eth_accounts" })
      
      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // In production, this would call the actual smart contract
      // For now, we'll simulate the transaction
      const tokenId = `LAND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      console.log("[v0] Minting Land NFT:", {
        tokenId,
        farmId,
        area,
        location,
        from: accounts[0]
      })

      // Simulate transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      // In production, you would:
      // 1. Call the smart contract's mint function
      // 2. Wait for transaction confirmation
      // 3. Return the actual token ID from the contract

      return tokenId
    } catch (error) {
      console.error("Failed to mint NFT:", error)
      return null
    }
  }

  async transferLandNFT(tokenId: string, toAddress: string): Promise<boolean> {
    try {
      console.log("[v0] Transferring NFT:", { tokenId, toAddress })

      // In production, this would call smart contract transfer function
      return true
    } catch (error) {
      console.error("Failed to transfer NFT:", error)
      return false
    }
  }

  async getLandNFTs(ownerAddress: string): Promise<LandNFT[]> {
    try {
      // In production, this would query blockchain for user's NFTs
      return []
    } catch (error) {
      console.error("Failed to get NFTs:", error)
      return []
    }
  }

  async createTransaction(to: string, amount: number, type: Transaction["type"]): Promise<Transaction | null> {
    try {
      const transaction: Transaction = {
        id: `TX-${Date.now()}`,
        from: "", // Would be set from connected wallet
        to,
        amount,
        type,
        timestamp: Date.now(),
        status: "pending",
      }

      console.log("[v0] Creating transaction:", transaction)

      // In production, this would submit transaction to blockchain
      return transaction
    } catch (error) {
      console.error("Failed to create transaction:", error)
      return null
    }
  }

  async getTransactionHistory(address: string): Promise<Transaction[]> {
    try {
      // In production, this would query blockchain for transaction history
      return []
    } catch (error) {
      console.error("Failed to get transaction history:", error)
      return []
    }
  }
}

export const blockchainService = new BlockchainService()
