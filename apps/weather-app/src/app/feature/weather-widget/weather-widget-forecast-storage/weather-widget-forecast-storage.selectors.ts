import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getAllForecastsSelector, WeatherWidgetForecastStorageState } from './weather-widget-forecast-storage.reducer';
import { WeatherWidgetForecaseStorageEntry } from './interfaces/weather-widget-forecast-storage-entry';

export const WEATHER_WIDGET_FORECAST_STORAGE_FEATURE_SELECTOR = 'weatherWidgetForecastStorageState';

export const getWeatherWidgetForecastStorageState = createFeatureSelector<WeatherWidgetForecastStorageState>(WEATHER_WIDGET_FORECAST_STORAGE_FEATURE_SELECTOR);

export const getAllForecasts = createSelector(getWeatherWidgetForecastStorageState, getAllForecastsSelector);

export const getForecastByPlaceName = (placeName: string) =>
    createSelector(getAllForecasts, (emtries: WeatherWidgetForecaseStorageEntry[]) =>
        emtries.find(({ placeName: name }: WeatherWidgetForecaseStorageEntry) => name === placeName),
    );

export const getForecastsInLoading = createSelector(
    getWeatherWidgetForecastStorageState,
    ({ forecastsInLoading }: WeatherWidgetForecastStorageState) => forecastsInLoading,
);
