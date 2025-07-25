import type { weather_type } from "../../Type/Dashtypes"
import Wind from "./WeatherComponent/Wind";

type Props = {
  weather: weather_type;
}

function Weather({ weather }: Props) {
  return <div className="weather-info">
    <Wind speed={weather.windSpeed} direction={weather.windDirection} />
    <p>AirTemp: {weather.airTemp}°C</p>
    <p>Humidity: {weather.humidity}%</p>
    <p>Pressure: {weather.pressure} hPa</p>
    <p>Rain: {weather.rainfall ? '✅' : '❌'}</p>
    <p>TrackTemp: {weather.trackTemp}°C</p>
  </div>
}

export default Weather