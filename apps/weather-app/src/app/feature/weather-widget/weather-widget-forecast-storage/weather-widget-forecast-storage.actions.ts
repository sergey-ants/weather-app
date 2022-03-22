import { WeatherWidgetForecastStorageActionTypes } from './enums/weather-widget-forecast-storage-action-types';
import { Action } from '@ngrx/store';
import { WeatherWidgetForecaseStorageEntry } from './interfaces/weather-widget-forecast-storage-entry';

export class ForecastFetchingRequestAction implements Action {
    public readonly type = WeatherWidgetForecastStorageActionTypes.requestForecastFetching;

    constructor(public readonly payload: { placeName: string }) {}
}

export class ForecastFetchingSuccessAction implements Action {
    public readonly type = WeatherWidgetForecastStorageActionTypes.forecastFetchingSuccess;

    constructor(public readonly payload: WeatherWidgetForecaseStorageEntry) {}
}

export class ForecastFetchingFailureAction implements Action {
    public readonly type = WeatherWidgetForecastStorageActionTypes.forecastFetchingFailure;

    constructor(public readonly payload: { placeName: string }) {}
}

export class RemoveForecastAction implements Action {
    public readonly type = WeatherWidgetForecastStorageActionTypes.removeForecast;

    constructor(public readonly payload: { placeName: string }) {}
}

export class ResetForecastsAction implements Action {
    public readonly type = WeatherWidgetForecastStorageActionTypes.resetForecasts;
}

export type WeatherWidgetForecastActions =
    | ForecastFetchingRequestAction
    | ForecastFetchingFailureAction
    | ForecastFetchingSuccessAction
    | RemoveForecastAction
    | ResetForecastsAction;
