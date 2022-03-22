import { OpenWeatherPlaceDto } from '../open-weather-api/dto/open-weather-place-dto';
import { WeatherWidgetPlaceStorageActionTypes } from './enums/weather-widget-place-storage-action-types';
import { Action } from '@ngrx/store';

export class PlaceFetchingRequestAction implements Action {
    public readonly type = WeatherWidgetPlaceStorageActionTypes.requestPlaceFetching;

    constructor(public readonly payload: { name: string }) {}
}

export class PlaceFetchingSuccessAction implements Action {
    public readonly type = WeatherWidgetPlaceStorageActionTypes.placeFetchingSuccess;

    constructor(public readonly payload: OpenWeatherPlaceDto) {}
}

export class PlaceFetchingFailureAction implements Action {
    public readonly type = WeatherWidgetPlaceStorageActionTypes.placeFetchingFailure;

    constructor(public readonly payload: { name: string }) {}
}

export class RemovePlaceAction implements Action {
    public readonly type = WeatherWidgetPlaceStorageActionTypes.removePlace;

    constructor(public readonly payload: OpenWeatherPlaceDto) {}
}

export class ResetPlacesAction implements Action {
    public readonly type = WeatherWidgetPlaceStorageActionTypes.resetPlaces;
}

export type WeatherWidgetPlaceStorageActions =
    | PlaceFetchingRequestAction
    | PlaceFetchingFailureAction
    | PlaceFetchingSuccessAction
    | RemovePlaceAction
    | ResetPlacesAction;
