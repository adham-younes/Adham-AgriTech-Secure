// ===========================================
// 🔥 SHΔDØW CORE V99 - API HEALTH CHECK 🔥
// ===========================================

import { apiValidator } from "@/lib/services/api-validator"

export async function GET() {
  try {
    const apiStatuses = await apiValidator.validateAllApis()
    
    const overallStatus = apiStatuses.every(status => status.status === 'active') 
      ? 'healthy' 
      : 'degraded'

    const activeServices = apiStatuses.filter(status => status.status === 'active').length
    const totalServices = apiStatuses.length

    return Response.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        total: totalServices,
        active: activeServices,
        inactive: totalServices - activeServices
      },
      apis: apiStatuses,
      message: overallStatus === 'healthy' 
        ? 'All APIs are operational' 
        : `${activeServices}/${totalServices} APIs are operational`
    })
  } catch (error) {
    console.error("[v0] Health check error:", error)
    return Response.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: 'Unable to verify API status'
    }, { status: 500 })
  }
}
