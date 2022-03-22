import { OpenWeatherForecastDto } from '../../open-weather-api/dto/open-weather-forecast-dto';
import { OpenWeatherTemperatureInterval } from '../../open-weather-api/enums/open-weather-temperature-interval';

export interface WeatherWidgetForecaseStorageEntry {
    placeName: string;
    forecast: OpenWeatherForecastDto;
    intervals: OpenWeatherTemperatureInterval[];
}
