import { Injectable } from '@angular/core';
import { NotificationLevel } from '@common/services/notification/enums/notification-level';
import { NotificationService } from '@common/services/notification/notification.service';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, throwError } from 'rxjs';
import { take, filter, tap, switchMap, catchError, share } from 'rxjs/operators';
import { OpenWeatherPlaceDto } from '../open-weather-api/dto/open-weather-place-dto';
import { OpenWeatherApiService } from '../open-weather-api/open-weather-api.service';
import { PlaceFetchingFailureAction, PlaceFetchingRequestAction, PlaceFetchingSuccessAction } from './weather-widget-place-storage.actions';
import { WeatherWidgetPlaceStorageState } from './weather-widget-place-storage.reducer';
import { getPlaceByName, getPlacesInLoading } from './weather-widget-place-storage.selectors';

@Injectable()
export class WeatherWidgetPlaceStorageService {
    private readonly placeResolvedSubject$ = new Subject<OpenWeatherPlaceDto>();
    public readonly placeResolved$ = this.placeResolvedSubject$.pipe(share());

    constructor(
        private readonly openWeatherApiService: OpenWeatherApiService,
        private readonly storage: Store<WeatherWidgetPlaceStorageState>,
        private readonly notificationService: NotificationService,
    ) {}

    public getOrFetchPlace$(placeName: string): Observable<OpenWeatherPlaceDto | undefined> {
        return this.storage.pipe(
            select(getPlaceByName(placeName)),
            tap(() => this.fetchPlaceIfNotExist(placeName)),
        );
    }

    public fetchPlaceIfNotExist(placeName: string): void {
        this.storage
            .pipe(
                select(getPlacesInLoading),
                take(1),
                filter((places: string[]) => !places.includes(placeName)),
                switchMap(() => this.storage.pipe(select(getPlaceByName(placeName)), take(1))),
                filter((place: OpenWeatherPlaceDto | undefined) => !place),
                switchMap(() => this.fetchPlace$(placeName)),
            )
            .subscribe();
    }

    private fetchPlace$(placeName: string): Observable<OpenWeatherPlaceDto | undefined> {
        this.storage.dispatch(new PlaceFetchingRequestAction({ name: placeName }));

        return this.openWeatherApiService.fetchPlace$(placeName).pipe(
            tap((place: OpenWeatherPlaceDto | undefined) => {
                if (!place) {
                    this.storage.dispatch(new PlaceFetchingFailureAction({ name: placeName }));
                    this.notificationService.showNotification(`Requested place isn't found: ${placeName}. Did you make a typo?`, NotificationLevel.Warning);

                    return;
                }

                this.placeResolvedSubject$.next(place);
                this.storage.dispatch(new PlaceFetchingSuccessAction(place));
            }),
            catchError((error: Error) => {
                this.storage.dispatch(new PlaceFetchingFailureAction({ name: placeName }));

                return throwError(() => new Error(JSON.stringify(error)));
            }),
        );
    }
}
