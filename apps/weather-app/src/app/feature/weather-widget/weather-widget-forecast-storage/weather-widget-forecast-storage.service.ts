import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isPresent } from '@utils/is-present';
import { Observable, throwError, of, Subject } from 'rxjs';
import { take, filter, tap, switchMap, catchError, map } from 'rxjs/operators';
import { OpenWeatherPlaceDto } from '../open-weather-api/dto/open-weather-place-dto';
import { OpenWeatherApiService } from '../open-weather-api/open-weather-api.service';
import { WeatherWidgetForecastStorageState } from './weather-widget-forecast-storage.reducer';
import { getForecastByPlaceName, getForecastsInLoading, getAllForecasts } from './weather-widget-forecast-storage.selectors';
import { WeatherWidgetForecaseStorageEntry } from './interfaces/weather-widget-forecast-storage-entry';
import { OpenWeatherTemperatureInterval } from '../open-weather-api/enums/open-weather-temperature-interval';
import {
    ForecastFetchingFailureAction,
    ForecastFetchingRequestAction,
    ForecastFetchingSuccessAction,
    RemoveForecastAction,
} from './weather-widget-forecast-storage.actions';
import { OpenWeatherForecastDto } from '../open-weather-api/dto/open-weather-forecast-dto';
import { difference, isEmpty } from 'lodash';
import { share } from 'rxjs/operators';

@Injectable()
export class WeatherWidgetForecastStorageService {
    private readonly forecastLoadedSubject$ = new Subject<WeatherWidgetForecaseStorageEntry>();
    public readonly forecastLoaded$ = this.forecastLoadedSubject$.pipe(share());

    constructor(private readonly openWeatherApiService: OpenWeatherApiService, private readonly storage: Store<WeatherWidgetForecastStorageState>) {}

    public getOrFetchForecast$(place: OpenWeatherPlaceDto, intervals: OpenWeatherTemperatureInterval[]): Observable<WeatherWidgetForecaseStorageEntry> {
        return this.storage.pipe(
            select(getForecastByPlaceName(place.name)),
            tap(() => this.fetchForecastIfNotExist(place, intervals)),
            filter(isPresent),
        );
    }

    public getAllForecasts$(): Observable<WeatherWidgetForecaseStorageEntry[]> {
        return this.storage.pipe(select(getAllForecasts));
    }

    public fetchForecastIfNotExist(place: OpenWeatherPlaceDto, intervals: OpenWeatherTemperatureInterval[]): void {
        this.storage
            .pipe(
                select(getForecastsInLoading),
                take(1),
                filter((forecastPlaces: string[]) => !forecastPlaces.includes(place.name)),
                switchMap(() => this.storage.pipe(select(getForecastByPlaceName(place.name)), take(1))),
                switchMap((entry: WeatherWidgetForecaseStorageEntry | undefined) => {
                    if (!entry) {
                        return this.fetchForecast$(place, intervals);
                    }

                    if (isEmpty(difference(entry.intervals, intervals)) && isEmpty(difference(intervals, entry.intervals))) {
                        return of(entry);
                    }

                    // TODO: introduce incremental updates in such cases. Possible only if count of available temperature intervals was changed.
                    this.storage.dispatch(new RemoveForecastAction({ placeName: place.name }));

                    return this.fetchForecast$(place, intervals);
                }),
            )
            .subscribe();
    }

    private fetchForecast$(
        { lat, lon, name }: OpenWeatherPlaceDto,
        intervals: OpenWeatherTemperatureInterval[],
    ): Observable<WeatherWidgetForecaseStorageEntry> {
        this.storage.dispatch(new ForecastFetchingRequestAction({ placeName: name }));

        return this.openWeatherApiService.fetchWeatherForecast$(lat, lon, intervals).pipe(
            map((forecast: OpenWeatherForecastDto) => ({
                forecast,
                placeName: name,
                intervals,
            })),
            tap((entry: WeatherWidgetForecaseStorageEntry) => {
                this.forecastLoadedSubject$.next(entry);
                this.storage.dispatch(new ForecastFetchingSuccessAction(entry));
            }),
            catchError((error: Error) => {
                this.storage.dispatch(new ForecastFetchingFailureAction({ placeName: name }));

                return throwError(() => new Error(JSON.stringify(error)));
            }),
        );
    }
}
