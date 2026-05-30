import axios from 'axios'

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

export const getWeather = (city) =>
  axios
    .get(baseUrl, { params: { q: city, appid: apiKey, units: 'metric' } })
    .then((response) => response.data)
