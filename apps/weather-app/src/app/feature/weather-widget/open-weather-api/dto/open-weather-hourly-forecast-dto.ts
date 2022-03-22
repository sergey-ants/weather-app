import { OpenWeatherWeatherDto } from './open-weather-weather-dto';

export interface OpenWeatherHourlyForecastDto {
    dt: number;
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
    wind_gust: number;
    weather: OpenWeatherWeatherDto[];
    pop: number;
}
