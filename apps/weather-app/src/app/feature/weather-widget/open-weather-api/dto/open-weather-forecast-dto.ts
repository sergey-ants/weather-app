import { OpenWeatherCurrentForecastDto } from './open-weather-current-forecast-dto';
import { OpenWeatherHourlyForecastDto } from './open-weather-hourly-forecast-dto';
import { OpenWeatherMinutelyForecastDto } from './open-weather-minutely-forecast-dto';
import { OpenWeatherDailyForecastDto } from './open-weather-daily-forecast-dto';
import { OpenWeatherForecastAlertsDto } from './open-weather-forecast-alerts-dto';

export interface OpenWeatherForecastDto {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: OpenWeatherCurrentForecastDto;
    minutely: OpenWeatherMinutelyForecastDto[];
    hourly: OpenWeatherHourlyForecastDto[];
    daily: OpenWeatherDailyForecastDto[];
    alerts: OpenWeatherForecastAlertsDto[];
}
