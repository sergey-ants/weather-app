import { OpenWeatherWeatherDto } from './open-weather-weather-dto';

export interface OpenWeatherCurrentForecastDto {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: OpenWeatherWeatherDto[];
    rain: Record<string, number>;
}
