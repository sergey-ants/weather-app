import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { OpenWeatherPlaceDto } from '../open-weather-api/dto/open-weather-place-dto';
import { WeatherWidgetPlaceStorageActions } from './weather-widget-place-storage.actions';
import { WeatherWidgetPlaceStorageActionTypes } from './enums/weather-widget-place-storage-action-types';

export const WEATHER_WIDGET_PLACE_STORAGE_ADAPTER = createEntityAdapter<OpenWeatherPlaceDto>({
    selectId: ({ name }: OpenWeatherPlaceDto) => name,
});

export interface WeatherWidgetPlaceStorageState extends EntityState<OpenWeatherPlaceDto> {
    placesInLoading: string[];
}

export const WEATHER_WIDGET_PLACE_STORAGE_INITIAL_STATE: WeatherWidgetPlaceStorageState = WEATHER_WIDGET_PLACE_STORAGE_ADAPTER.getInitialState({
    placesInLoading: [] as string[],
});

export function weatherWidgetPlaceStorageReducer(
    state = WEATHER_WIDGET_PLACE_STORAGE_INITIAL_STATE,
    action: WeatherWidgetPlaceStorageActions,
): WeatherWidgetPlaceStorageState {
    switch (action.type) {
        case WeatherWidgetPlaceStorageActionTypes.requestPlaceFetching:
            return {
                ...state,
                placesInLoading: [...state.placesInLoading, action.payload.name.toLowerCase()],
            };

        case WeatherWidgetPlaceStorageActionTypes.placeFetchingFailure:
            return {
                ...state,
                placesInLoading: state.placesInLoading.filter((placeName: string) => placeName.toLowerCase() !== action.payload.name.toLowerCase()),
            };

        case WeatherWidgetPlaceStorageActionTypes.placeFetchingSuccess:
            return WEATHER_WIDGET_PLACE_STORAGE_ADAPTER.addOne(action.payload, {
                ...state,
                placesInLoading: state.placesInLoading.filter((placeName: string) => placeName.toLowerCase() !== action.payload.name.toLowerCase()),
            });

        case WeatherWidgetPlaceStorageActionTypes.removePlace:
            return WEATHER_WIDGET_PLACE_STORAGE_ADAPTER.removeOne(action.payload.name.toLowerCase(), state);

        case WeatherWidgetPlaceStorageActionTypes.resetPlaces:
            return WEATHER_WIDGET_PLACE_STORAGE_ADAPTER.removeAll(state);

        default:
            return state;
    }
}

export const { selectAll: getAllPlacesSelector } = WEATHER_WIDGET_PLACE_STORAGE_ADAPTER.getSelectors();
