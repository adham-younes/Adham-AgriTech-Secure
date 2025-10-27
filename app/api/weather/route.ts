export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Cairo,EG"
    const lang = searchParams.get("lang") || "en"

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.error("[v0] OpenWeather API key not configured")
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${lang}`,
    )

    if (!currentResponse.ok) {
      console.error("[v0] OpenWeather API error:", await currentResponse.text())
      return Response.json({ error: "Failed to fetch weather data" }, { status: currentResponse.status })
    }

    const currentData = await currentResponse.json()

    // Fetch 7-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=56&lang=${lang}`,
    )

    if (!forecastResponse.ok) {
      console.error("[v0] OpenWeather forecast API error:", await forecastResponse.text())
      return Response.json({ error: "Failed to fetch forecast data" }, { status: forecastResponse.status })
    }

    const forecastData = await forecastResponse.json()

    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const processedDates = new Set()

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]
      if (!processedDates.has(date) && dailyForecasts.length < 7) {
        processedDates.add(date)
        dailyForecasts.push({
          date: new Date(item.dt * 1000).toISOString(),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          condition: item.weather[0].description,
        })
      }
    }

    return Response.json({
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        visibility: currentData.visibility,
        pressure: currentData.main.pressure,
        condition: currentData.weather[0].description,
      },
      forecast: dailyForecasts,
    })
  } catch (error) {
    console.error("[v0] Error fetching weather:", error)
    return Response.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
