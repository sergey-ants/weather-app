import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getAllPlacesSelector, WeatherWidgetPlaceStorageState } from './weather-widget-place-storage.reducer';
import { OpenWeatherPlaceDto } from '../open-weather-api/dto/open-weather-place-dto';

export const WEATHER_WIDGET_PLACE_STORAGE_FEATURE_SELECTOR = 'weatherWidgetPlaceStorageState';

export const getWeatherWidgetPlaceStorageState = createFeatureSelector<WeatherWidgetPlaceStorageState>(WEATHER_WIDGET_PLACE_STORAGE_FEATURE_SELECTOR);

export const getAllPlaces = createSelector(getWeatherWidgetPlaceStorageState, getAllPlacesSelector);

export const getPlaceByName = (placeName: string) =>
    createSelector(getAllPlaces, (places: OpenWeatherPlaceDto[]) =>
        places.find(({ name }: OpenWeatherPlaceDto) => name.toLowerCase() === placeName.toLowerCase()),
    );

export const getPlacesInLoading = createSelector(getWeatherWidgetPlaceStorageState, ({ placesInLoading }: WeatherWidgetPlaceStorageState) => placesInLoading);
