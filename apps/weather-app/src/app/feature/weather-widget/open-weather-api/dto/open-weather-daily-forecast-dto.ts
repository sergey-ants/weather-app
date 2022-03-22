import { OpenWeatherWeatherDto } from './open-weather-weather-dto';
import { OpenWeatherDailyTemperatureDto } from './open-weather-daily-temperature-dto';
import { OpenWeatherDailyFeelsLikeTemperatureDto } from './open-weather-daily-feels-like-temperature-dto';

export interface OpenWeatherDailyForecastDto {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: OpenWeatherDailyTemperatureDto;
    feels_like: OpenWeatherDailyFeelsLikeTemperatureDto;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    weather: OpenWeatherWeatherDto[];
    clouds: number;
    pop: number;
    rain: number;
    uvi: number;
}
