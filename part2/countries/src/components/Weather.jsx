import { useEffect, useState } from 'react'
import { getWeather } from '../services/weather'

const Weather = ({ city }) => {
  const [state, setState] = useState({ status: 'loading', data: null })

  useEffect(() => {
    let cancelled = false
    getWeather(city)
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', data: null })
      })
    return () => {
      cancelled = true
    }
  }, [city])

  if (state.status === 'error') return <p>Weather data unavailable</p>
  if (state.status === 'loading') return <p>Loading weather...</p>

  const { data } = state
  const [info] = data.weather
  const iconUrl = `https://openweathermap.org/img/wn/${info.icon}@2x.png`

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>temperature {data.main.temp} Celsius</p>
      <img src={iconUrl} alt={info.description} />
      <p>wind {data.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
