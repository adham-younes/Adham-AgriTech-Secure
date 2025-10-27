"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Shield, FileText, TrendingUp } from "lucide-react"
import { blockchainService } from "@/lib/blockchain/contract"

export default function BlockchainPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    const address = await blockchainService.connectWallet()
    setWalletAddress(address)
    setIsConnecting(false)
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">البلوكتشين والعقود الذكية</h1>
        <p className="text-muted-foreground">Blockchain & Smart Contracts</p>
      </div>

      {/* Wallet Connection */}
      <Card className="depth-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            محفظة البلوكتشين
          </CardTitle>
          <CardDescription>Connect your Web3 wallet to access blockchain features</CardDescription>
        </CardHeader>
        <CardContent>
          {walletAddress ? (
            <div className="space-y-4">
              <div className="glass-card rounded-lg p-4">
                <p className="mb-1 text-sm text-muted-foreground">Connected Wallet</p>
                <p className="font-mono text-sm">{walletAddress}</p>
              </div>
              <Button variant="outline" onClick={() => setWalletAddress(null)}>
                قطع الاتصال
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnectWallet} disabled={isConnecting} className="w-full sm:w-auto">
              {isConnecting ? "جاري الاتصال..." : "ربط المحفظة"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="depth-card hover-lift">
          <CardHeader>
            <Shield className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>ملكية الأراضي NFT</CardTitle>
            <CardDescription>Land Ownership NFTs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">سجل ملكية أراضيك على البلوكتشين كرموز NFT غير قابلة للتزوير</p>
          </CardContent>
        </Card>

        <Card className="depth-card hover-lift">
          <CardHeader>
            <FileText className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>العقود الذكية</CardTitle>
            <CardDescription>Smart Contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">عقود تلقائية للبيع والشراء والتأمين بدون وسطاء</p>
          </CardContent>
        </Card>

        <Card className="depth-card hover-lift">
          <CardHeader>
            <TrendingUp className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>المعاملات الشفافة</CardTitle>
            <CardDescription>Transparent Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">تتبع جميع المعاملات بشفافية كاملة على البلوكتشين</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
