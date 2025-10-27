"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface ApiStatus {
  service: string
  status: 'active' | 'inactive' | 'error'
  lastChecked: string
  error?: string
}

interface HealthResponse {
  status: string
  timestamp: string
  services: {
    total: number
    active: number
    inactive: number
  }
  apis: ApiStatus[]
  message: string
}

export default function ApiStatusPage() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthData(data)
    } catch (error) {
      console.error('Failed to fetch health status:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHealthStatus()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchHealthStatus()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'inactive':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Status Dashboard</h1>
          <p className="text-muted-foreground">مراقبة حالة جميع خدمات APIs</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          تحديث
        </Button>
      </div>

      {/* Overall Status */}
      {healthData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(healthData.status)}
              Overall Status: {healthData.status.toUpperCase()}
            </CardTitle>
            <CardDescription>
              {healthData.message} • Last updated: {new Date(healthData.timestamp).toLocaleString('ar-EG')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{healthData.services.active}</div>
                <div className="text-sm text-muted-foreground">Active Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{healthData.services.inactive}</div>
                <div className="text-sm text-muted-foreground">Inactive Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{healthData.services.total}</div>
                <div className="text-sm text-muted-foreground">Total Services</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual API Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData?.apis.map((api) => (
          <Card key={api.service}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{api.service}</CardTitle>
                {getStatusIcon(api.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(api.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Checked:</span>
                  <span className="text-sm">
                    {new Date(api.lastChecked).toLocaleTimeString('ar-EG')}
                  </span>
                </div>
                {api.error && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                    <strong>Error:</strong> {api.error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>إعداد مفاتيح APIs</CardTitle>
          <CardDescription>
            تأكد من إعداد جميع مفاتيح APIs المطلوبة في ملف .env.local
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🔑 المفاتيح المطلوبة:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>• OPENWEATHER_API_KEY</li>
                  <li>• OPENAI_API_KEY</li>
                  <li>• GOOGLE_EARTH_ENGINE_API_KEY</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📋 خطوات الإعداد:</h4>
                <ol className="text-sm space-y-1 text-muted-foreground">
                  <li>1. انسخ .env.example إلى .env.local</li>
                  <li>2. املأ جميع المفاتيح المطلوبة</li>
                  <li>3. أعد تشغيل الخادم</li>
                  <li>4. تحقق من حالة APIs هنا</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
