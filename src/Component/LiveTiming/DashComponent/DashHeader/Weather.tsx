import type { weather_type } from "../../../../Type/Dashtypes"

type Props = {
  weather: weather_type;
}

function Weather({ weather }: Props) {
  return <div className="weather-info">
    <h4>WEATHER</h4>
    <p>AirTemp: {weather.airTemp}°C</p>
    <p>Humidity: {weather.humidity}%</p>
    <p>Pressure: {weather.pressure} hPa</p>
    <p>Rain: {weather.rainfall ? '✅' : '❌'}</p>
    <p>TrackTemp: {weather.trackTemp}°C</p>
    <p>WindDirection: {weather.windDirection}°</p>
    <p>WindSpeed: {weather.windSpeed.toFixed(2)} km/h</p>
  </div>
}

export default Weather