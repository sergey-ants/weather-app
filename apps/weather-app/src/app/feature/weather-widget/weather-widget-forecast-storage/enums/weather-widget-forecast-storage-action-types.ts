export enum WeatherWidgetForecastStorageActionTypes {
    requestForecastFetching = '[WeatherWidgetForecastStorage] request forecast fetching',
    forecastFetchingFailure = '[WeatherWidgetForecastStorage] failure forecast fetching',
    forecastFetchingSuccess = '[WeatherWidgetForecastStorage] success forecast fetching',
    removeForecast = '[WeatherWidgetForecastStorage] remove forecast',
    resetForecasts = '[WeatherWidgetForecastStorage] reset forecasts',
}
