import { HostListener, Inject, Self, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { DestroyService } from '@common/services/destroy/destroy.service';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { filter, takeUntil, catchError } from 'rxjs/operators';
import { OpenWeatherPlaceDto } from './open-weather-api/dto/open-weather-place-dto';
import { capitalize } from 'lodash';
import { NotificationService } from '@common/services/notification/notification.service';
import { NotificationLevel } from '@common/services/notification/enums/notification-level';
import { ElementRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { OpenWeatherTemperatureInterval } from './open-weather-api/enums/open-weather-temperature-interval';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherWidgetRoutingParams } from './interfaces/weather-widget-routing-params';
import { WEATHER_WIDGET_FORECAST_TABLE_ROUTING_PATH } from './weather-widget-forecast-table/weather-widget-forecast-table-routing-path';
import { WEATHER_WIDGET_ROUTING_PATH } from './weather-widget-routing-path';
import { isPresent } from 'app/utils/is-present';
import { WEATHER_WIDGET_AVAILABLE_FORECAST_INTERVALS } from './weather-widget-available-forecast-intervals';
import { WeatherWidgetPlaceStorageService } from './weather-widget-place-storage/weather-widget-place-storage.service';
import { WeatherWidgetForecastStorageService } from './weather-widget-forecast-storage/weather-widget-forecast-storage.service';

@Component({
    selector: 'weather-app-weather-widget',
    templateUrl: 'weather-widget.component.html',
    styleUrls: ['weather-widget.component.scss'],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidgetComponent implements OnInit {
    public placeName = '';

    public readonly OpenWeatherTemperatureInterval = OpenWeatherTemperatureInterval;
    public readonly availableForecastIntervals = WEATHER_WIDGET_AVAILABLE_FORECAST_INTERVALS;

    private readonly requestPlaceResolve$ = new Subject<string>();
    private readonly defaultForecastInterval = OpenWeatherTemperatureInterval.Hourly;
    private readonly forecastInterval$ = new BehaviorSubject<OpenWeatherTemperatureInterval | null>(null);

    @ViewChild('placeInput', { static: true })
    input: ElementRef<HTMLInputElement>;

    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler() {
        this.requestPlaceResolve$.next(this.placeName);
        this.input.nativeElement.blur();
        this.placeName = '';
    }

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly weatherWidgetPlaceStorageService: WeatherWidgetPlaceStorageService,
        private readonly weatherWidgetForecastStorageService: WeatherWidgetForecastStorageService,
        private readonly notificationService: NotificationService,
        @Self()
        @Inject(DestroyService)
        private readonly destroy$: DestroyService,
    ) {}

    ngOnInit(): void {
        this.initForecastIntervalStream();
        this.initRouterStream();
        this.initRequestPlaceResolveStream();
        this.initPlaceLoadedStream();
    }

    public set forecastInterval(value: OpenWeatherTemperatureInterval | null) {
        this.forecastInterval$.next(value);
    }

    public get forecastInterval(): OpenWeatherTemperatureInterval | null {
        return this.forecastInterval$.getValue();
    }

    public getFormattedInterval(value: OpenWeatherTemperatureInterval): string {
        return capitalize(value);
    }

    private initForecastIntervalStream(): void {
        this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(({ interval }: WeatherWidgetRoutingParams) => {
            if (!interval) {
                this.forecastInterval = this.defaultForecastInterval;

                return;
            }

            if (!WEATHER_WIDGET_AVAILABLE_FORECAST_INTERVALS.includes(interval)) {
                this.notificationService.showNotification(
                    `Requested interval isn't supported. Set to '${this.defaultForecastInterval}' instead.`,
                    NotificationLevel.Warning,
                );

                this.forecastInterval = this.defaultForecastInterval;

                return;
            }

            this.forecastInterval = interval;
        });
    }

    private initRouterStream(): void {
        this.forecastInterval$.pipe(filter(isPresent), takeUntil(this.destroy$)).subscribe((value: OpenWeatherTemperatureInterval) => {
            this.router.navigate([`${WEATHER_WIDGET_ROUTING_PATH}/${value}/${WEATHER_WIDGET_FORECAST_TABLE_ROUTING_PATH}`]);
        });
    }

    private initRequestPlaceResolveStream(): void {
        this.requestPlaceResolve$
            .pipe(
                switchMap((placeName: string) => this.weatherWidgetPlaceStorageService.getOrFetchPlace$(placeName)),
                catchError((error: Error) => {
                    this.notificationService.showNotification(`Error occured during resolving city request: ${error.message}.`, NotificationLevel.Error);

                    return EMPTY;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe();
    }

    private initPlaceLoadedStream(): void {
        this.weatherWidgetPlaceStorageService.placeResolved$
            .pipe(
                switchMap((place: OpenWeatherPlaceDto) => this.weatherWidgetForecastStorageService.getOrFetchForecast$(place, this.availableForecastIntervals)),
                catchError((error: Error) => {
                    this.notificationService.showNotification(`Error occured during weather forecast request: ${error.message}.`, NotificationLevel.Error);

                    return EMPTY;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe();
    }
}
