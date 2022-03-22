import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { WeatherWidgetForecastActions } from './weather-widget-forecast-storage.actions';
import { WeatherWidgetForecastStorageActionTypes } from './enums/weather-widget-forecast-storage-action-types';
import { WeatherWidgetForecaseStorageEntry } from './interfaces/weather-widget-forecast-storage-entry';

export const WEATHER_WIDGET_FORECAST_STORAGE_ADAPTER = createEntityAdapter<WeatherWidgetForecaseStorageEntry>({
    selectId: ({ placeName }: WeatherWidgetForecaseStorageEntry) => placeName,
});

export interface WeatherWidgetForecastStorageState extends EntityState<WeatherWidgetForecaseStorageEntry> {
    forecastsInLoading: string[];
}

export const WEATHER_WIDGET_PLACE_STORAGE_INITIAL_STATE: WeatherWidgetForecastStorageState = WEATHER_WIDGET_FORECAST_STORAGE_ADAPTER.getInitialState({
    forecastsInLoading: [] as string[],
});

export function weatherWidgetForecastStorageReducer(
    state = WEATHER_WIDGET_PLACE_STORAGE_INITIAL_STATE,
    action: WeatherWidgetForecastActions,
): WeatherWidgetForecastStorageState {
    switch (action.type) {
        case WeatherWidgetForecastStorageActionTypes.requestForecastFetching:
            return {
                ...state,
                forecastsInLoading: [...state.forecastsInLoading, action.payload.placeName],
            };

        case WeatherWidgetForecastStorageActionTypes.forecastFetchingFailure:
            return {
                ...state,
                forecastsInLoading: state.forecastsInLoading.filter((placeName: string) => placeName !== action.payload.placeName),
            };

        case WeatherWidgetForecastStorageActionTypes.forecastFetchingSuccess:
            return WEATHER_WIDGET_FORECAST_STORAGE_ADAPTER.addOne(action.payload, {
                ...state,
                placesInLoading: state.forecastsInLoading.filter((placeName: string) => placeName !== action.payload.placeName),
            });

        case WeatherWidgetForecastStorageActionTypes.removeForecast:
            return WEATHER_WIDGET_FORECAST_STORAGE_ADAPTER.removeOne(action.payload.placeName, state);

        case WeatherWidgetForecastStorageActionTypes.resetForecasts:
            return WEATHER_WIDGET_FORECAST_STORAGE_ADAPTER.removeAll(state);

        default:
            return state;
    }
}

export const { selectAll: getAllForecastsSelector } = WEATHER_WIDGET_FORECAST_STORAGE_ADAPTER.getSelectors();
