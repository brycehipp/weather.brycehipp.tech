import 'babel-polyfill'

async function getWeather(lat, lon) {
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
  ).then(res => res.json())

  console.log(weather)
}

navigator.geolocation.getCurrentPosition(
  location => {
    const { latitude, longitude } = location.coords
    console.log({ latitude, longitude })
    getWeather(latitude, longitude)
  },
  err => {
    console.log(err)
  },
)
