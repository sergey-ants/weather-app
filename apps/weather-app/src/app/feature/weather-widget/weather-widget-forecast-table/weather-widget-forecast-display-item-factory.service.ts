import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { OpenWeatherDailyForecastDto } from '../open-weather-api/dto/open-weather-daily-forecast-dto';
import { OpenWeatherHourlyForecastDto } from '../open-weather-api/dto/open-weather-hourly-forecast-dto';
import { WeatherWidgetForecaseStorageEntry } from '../weather-widget-forecast-storage/interfaces/weather-widget-forecast-storage-entry';
import { WeatherWidgetForecastDisplayItem } from './interfaces/weather-widget-forecast-display-item';

@Injectable()
export class WeatherWidgetForecastDisplayItemFactory {
    public createDailyDisplayItem(entry: WeatherWidgetForecaseStorageEntry): WeatherWidgetForecastDisplayItem {
        const dailyForecast = entry.forecast.daily;

        if (isEmpty(dailyForecast)) {
            throw new Error(`Cannot find daily forecast for the following place: ${entry.placeName}`);
        }

        const temperatureByDay = new Map(
            dailyForecast.map((dailyForecastItem: OpenWeatherDailyForecastDto) => [
                this.convertUnixTimeMsToUtcDate(dailyForecastItem.dt).getDay(),
                this.formatTemperature(dailyForecastItem.temp.day),
            ]),
        );

        return {
            placeName: entry.placeName,
            temperatureMap: temperatureByDay,
        };
    }

    public createHourlyDisplayItem(entry: WeatherWidgetForecaseStorageEntry): WeatherWidgetForecastDisplayItem {
        const hourlyForecast = entry.forecast.hourly;

        if (isEmpty(hourlyForecast)) {
            throw new Error(`Cannot find hourly forecast for the following place: ${entry.placeName}`);
        }

        const temperatureByTime = new Map(
            hourlyForecast.map((hourlyForecastItem: OpenWeatherHourlyForecastDto) => [
                this.convertUnixTimeMsToUtcDate(hourlyForecastItem.dt).getHours(),
                this.formatTemperature(hourlyForecastItem.temp),
            ]),
        );

        return {
            placeName: entry.placeName,
            temperatureMap: temperatureByTime,
        };
    }

    private convertUnixTimeMsToUtcDate(unixTimeMs: number): Date {
        return new Date(unixTimeMs * 1000);
    }

    private formatTemperature(temperature: number): string {
        return `${temperature.toFixed(2)}°`;
    }
}
