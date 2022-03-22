import { WeatherWidgetRoutingParam } from '../enums/weather-widget-routing-param';
import { OpenWeatherTemperatureInterval } from '../open-weather-api/enums/open-weather-temperature-interval';

export interface WeatherWidgetRoutingParams {
    [WeatherWidgetRoutingParam.Interval]?: OpenWeatherTemperatureInterval;
}
