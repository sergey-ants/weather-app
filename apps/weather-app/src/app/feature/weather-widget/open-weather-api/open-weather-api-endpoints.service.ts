import { Inject, Injectable } from '@angular/core';
import { OpenWeatherTemperatureInterval } from './enums/open-weather-temperature-interval';
import { OPEN_WEATHER_API_KEY } from './tokens/open-weather-api-key';
import { difference } from 'lodash';

@Injectable()
export class OpenWeatherApiEndpointsService {
    private readonly openWeatherMapMain = 'https://api.openweathermap.org/';

    constructor(
        @Inject(OPEN_WEATHER_API_KEY)
        private readonly openWeatherApiKey: string,
    ) {}

    public getPlace(name: string): string {
        return `${this.openWeatherMapMain}/geo/1.0/direct?q=${name}&limit=1&appid=${this.openWeatherApiKey}`;
    }

    public getWeatherForecast(latitude: number, longitude: number, intervals: OpenWeatherTemperatureInterval[]): string {
        const exludeData = difference(Object.values(OpenWeatherTemperatureInterval), intervals).join(',');

        return (
            `${this.openWeatherMapMain}/data/2.5/onecall?` +
            `lat=${latitude}&lon=${longitude}&exclude=${exludeData},alerts&units=metric&appid=${this.openWeatherApiKey}`
        );
    }
}
