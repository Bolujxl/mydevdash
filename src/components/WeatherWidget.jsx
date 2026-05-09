import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import '../styles/WeatherWidget.css'

const WEATHER_CITY_KEY = 'devdash_weather_city'

/** Map weather description text to an emoji */
function getWeatherEmoji(description) {
  const desc = description.toLowerCase()
  if (desc.includes('sunny') || desc.includes('clear')) return '☀️'
  if (desc.includes('partly cloudy')) return '⛅'
  if (desc.includes('cloudy') || desc.includes('overcast')) return '☁️'
  if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️'
  if (desc.includes('thunder') || desc.includes('storm')) return '⛈️'
  if (desc.includes('snow')) return '❄️'
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return '🌫️'
  if (desc.includes('wind')) return '💨'
  return '🌤️'
}

function getInitialCity() {
  try {
    const saved = localStorage.getItem(WEATHER_CITY_KEY)
    return saved || 'Lagos'
  } catch {
    return 'Lagos'
  }
}

function WeatherWidget() {
  const [city, setCity] = useState(getInitialCity)
  const [fetchCity, setFetchCity] = useState(getInitialCity)

  const url = fetchCity
    ? `https://wttr.in/${encodeURIComponent(fetchCity)}?format=j1`
    : null
  const { data, loading, error } = useFetch(url)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = city.trim()
    if (trimmed) {
      setFetchCity(trimmed)
      try {
        localStorage.setItem(WEATHER_CITY_KEY, trimmed)
      } catch {
        // localStorage unavailable
      }
    }
  }

  // Extract weather data from the wttr.in response
  const weather = data?.current_condition?.[0]
  const tempC = weather?.temp_C
  const description = weather?.weatherDesc?.[0]?.value || ''
  const areaName = data?.nearest_area?.[0]?.areaName?.[0]?.value || fetchCity

  return (
    <div className="weather-widget">
      <h2 className="widget-title">🌤️ Weather</h2>

      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="weather-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button type="submit" className="weather-btn">Get Weather</button>
      </form>

      {loading && (
        <div className="weather-loading">
          <div className="spinner"></div>
          <span>Fetching weather...</span>
        </div>
      )}

      {error && <p className="weather-error">❌ {error}</p>}

      {!loading && !error && weather && (
        <div className="weather-info">
          <div className="weather-main">
            <span className="weather-emoji">{getWeatherEmoji(description)}</span>
            <span className="weather-temp">{tempC}°C</span>
          </div>
          <p className="weather-city">{areaName}</p>
          <p className="weather-desc">{description}</p>
        </div>
      )}
    </div>
  )
}

export default WeatherWidget
