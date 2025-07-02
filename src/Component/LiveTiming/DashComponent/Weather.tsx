import type { weather_type } from "../Dashtypes"

type Props = {
  weather: weather_type;
}

function Weather({ weather }: Props) {
  return <div className="weather-info">
    <h4>WEATHER</h4>
    <p>AirTemp: {weather.airTemp}</p>
    <p>Humidity: {weather.humidity}</p>
    <p>Pressure:: {weather.pressure}</p>
    <p>Rainfall: {weather.rainfall}</p>
    <p>TrackTemp: {weather.trackTemp}</p>
    <p>WindDirection: {weather.windDirection}</p>
    <p>WindSpeed: {weather.windSpeed}</p>
  </div>
}

export default Weather