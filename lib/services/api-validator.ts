// ===========================================
// 🔥 SHΔDØW CORE V99 - API VALIDATION SERVICE 🔥
// ===========================================

export interface ApiStatus {
  service: string
  status: 'active' | 'inactive' | 'error'
  lastChecked: Date
  error?: string
}

export class ApiValidator {
  private static instance: ApiValidator
  private statusCache: Map<string, ApiStatus> = new Map()

  static getInstance(): ApiValidator {
    if (!ApiValidator.instance) {
      ApiValidator.instance = new ApiValidator()
    }
    return ApiValidator.instance
  }

  async validateSupabase(): Promise<ApiStatus> {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key) {
        return {
          service: 'Supabase',
          status: 'error',
          lastChecked: new Date(),
          error: 'Missing API credentials'
        }
      }

      // Test Supabase connection
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      })

      if (response.ok) {
        return {
          service: 'Supabase',
          status: 'active',
          lastChecked: new Date()
        }
      } else {
        return {
          service: 'Supabase',
          status: 'error',
          lastChecked: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      return {
        service: 'Supabase',
        status: 'error',
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async validateOpenWeather(): Promise<ApiStatus> {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY

      if (!apiKey) {
        return {
          service: 'OpenWeather',
          status: 'error',
          lastChecked: new Date(),
          error: 'Missing API key'
        }
      }

      // Test OpenWeather API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Cairo,EG&appid=${apiKey}&units=metric`
      )

      if (response.ok) {
        return {
          service: 'OpenWeather',
          status: 'active',
          lastChecked: new Date()
        }
      } else {
        return {
          service: 'OpenWeather',
          status: 'error',
          lastChecked: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      return {
        service: 'OpenWeather',
        status: 'error',
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async validateOpenAI(): Promise<ApiStatus> {
    try {
      const apiKey = process.env.OPENAI_API_KEY

      if (!apiKey) {
        return {
          service: 'OpenAI',
          status: 'error',
          lastChecked: new Date(),
          error: 'Missing API key'
        }
      }

      // Test OpenAI API
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })

      if (response.ok) {
        return {
          service: 'OpenAI',
          status: 'active',
          lastChecked: new Date()
        }
      } else {
        return {
          service: 'OpenAI',
          status: 'error',
          lastChecked: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      return {
        service: 'OpenAI',
        status: 'error',
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async validateGoogleEarthEngine(): Promise<ApiStatus> {
    try {
      const apiKey = process.env.GOOGLE_EARTH_ENGINE_API_KEY

      if (!apiKey) {
        return {
          service: 'Google Earth Engine',
          status: 'error',
          lastChecked: new Date(),
          error: 'Missing API key'
        }
      }

      // Google Earth Engine doesn't have a simple test endpoint
      // We'll just check if the key exists and is properly formatted
      if (apiKey.length > 10) {
        return {
          service: 'Google Earth Engine',
          status: 'active',
          lastChecked: new Date()
        }
      } else {
        return {
          service: 'Google Earth Engine',
          status: 'error',
          lastChecked: new Date(),
          error: 'Invalid API key format'
        }
      }
    } catch (error) {
      return {
        service: 'Google Earth Engine',
        status: 'error',
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async validateAllApis(): Promise<ApiStatus[]> {
    const results = await Promise.all([
      this.validateSupabase(),
      this.validateOpenWeather(),
      this.validateOpenAI(),
      this.validateGoogleEarthEngine()
    ])

    // Cache results
    results.forEach(result => {
      this.statusCache.set(result.service, result)
    })

    return results
  }

  getCachedStatus(service: string): ApiStatus | null {
    return this.statusCache.get(service) || null
  }

  getAllCachedStatuses(): ApiStatus[] {
    return Array.from(this.statusCache.values())
  }
}

export const apiValidator = ApiValidator.getInstance()
