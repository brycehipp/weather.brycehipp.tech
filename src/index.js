import 'babel-polyfill'
import 'weather-underground-icons'

function renderWeather({ city, temp, feelsLike, weatherClass }) {
  document.getElementById('currentTemp').innerHTML = temp
  document.getElementById('feelTemp').innerHTML = feelsLike
  document.getElementById('location').innerHTML = city
  document.getElementById('weatherIcon').classList.add(weatherClass)

  document.getElementById('loader').classList.toggle('hidden')
  document.getElementById('weather').classList.toggle('hidden')
}

function renderError({ denied = false, unavailable = false }) {
  const errorDiv = document.getElementById('error')
  errorDiv.innerHTML = denied
    ? 'Please allow access to your location to see the current weather.'
    : 'Unable to get location'

  document.getElementById('loader').classList.toggle('hidden')
  errorDiv.classList.toggle('hidden')
}

function getFormattedTemp(temp) {
  const celsius = temp - 273
  const fahrenheit = Math.floor(celsius * (9 / 5) + 32)
  return `${fahrenheit}°F`
}

function getWeatherClass(weatherCode) {
  switch (weatherCode.replace(/\D/g, '')) {
    case '01':
      return 'wu-clear'
    case '02':
      return 'wu-partlycloudy'
    case '03':
      return 'wu-mostlycloudy'
    case '04':
      return 'wu-cloudy'
    case '09':
      return 'wu-chancerain'
    case '10':
      return 'wu-rain'
    case '11':
      return 'wu-tstorms'
    case '13':
      return 'wu-snow'
    case '50':
      return 'wu-hazy'
    default:
      return 'wu-unknown'
  }
}

async function getWeather(lat, lon) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9324ab40d302ad0be1d43a4c95172b69`,
  ).then(res => res.json())
  const city = data.name
  const kelvinTemp = data.main.temp
  const kelvinFeelsLike = data.main.feels_like
  const weatherCode = data.weather[0].icon

  renderWeather({
    city,
    temp: getFormattedTemp(kelvinTemp),
    feelsLike: getFormattedTemp(kelvinFeelsLike),
    weatherClass: getWeatherClass(weatherCode),
  })
}

navigator.geolocation.getCurrentPosition(
  location => {
    const { latitude, longitude } = location.coords
    getWeather(latitude, longitude)
  },
  err => {
    renderError({
      denied: err.code === err.PERMISSION_DENIED,
      unavailable: err.code === err.POSITION_UNAVAILABLE,
    })
  },
)
