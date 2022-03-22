import { Component, Inject, OnInit, Self, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from '@common/services/destroy/destroy.service';
import { isPresent } from '@utils/is-present';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, filter, map, switchMap } from 'rxjs/operators';
import { WeatherWidgetRoutingParams } from '../interfaces/weather-widget-routing-params';
import { OpenWeatherTemperatureInterval } from '../open-weather-api/enums/open-weather-temperature-interval';
import { WEATHER_WIDGET_AVAILABLE_FORECAST_INTERVALS } from '../weather-widget-available-forecast-intervals';
import { WeatherWidgetForecastStorageService } from '../weather-widget-forecast-storage/weather-widget-forecast-storage.service';
import { WeatherWidgetForecaseStorageEntry } from '../weather-widget-forecast-storage/interfaces/weather-widget-forecast-storage-entry';
import { WeatherWidgetForecastDisplayItemFactory } from './weather-widget-forecast-display-item-factory.service';
import { WeatherWidgetForecastDisplayItem } from './interfaces/weather-widget-forecast-display-item';
import { WeatherWidgetColumn } from './interfaces/weather-widget-column';
import { MatTableDataSource } from '@angular/material/table';
import { range } from 'lodash';

@Component({
    selector: 'weather-app-weather-widget-forecast-table',
    templateUrl: 'weather-widget-forecast-table.component.html',
    styleUrls: ['weather-widget-forecast-table.component.scss'],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidgetForecastTableComponent implements OnInit {
    public readonly forecastInterval$ = new BehaviorSubject<OpenWeatherTemperatureInterval | null>(null);
    public readonly daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    public readonly displayItems$ = new BehaviorSubject<WeatherWidgetForecastDisplayItem[]>([]);
    public readonly dataSource = new MatTableDataSource();

    public columns$: Observable<WeatherWidgetColumn[]>;
    public displayedColumns$: Observable<string[]>;

    private readonly displayHoursStep = 3;
    private readonly totalHoursInDay = 24;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly weatherWidgetForecastStorageService: WeatherWidgetForecastStorageService,
        private readonly weatherWidgetForecastDisplayItemFactory: WeatherWidgetForecastDisplayItemFactory,
        private readonly changeDetectorRef: ChangeDetectorRef,
        @Self()
        @Inject(DestroyService)
        private readonly destroy$: DestroyService,
    ) {}

    ngOnInit(): void {
        this.initForecastIntervalStream();
        this.initDataSourceStreams();
        this.initColumnStreams();
    }

    private initForecastIntervalStream(): void {
        this.activatedRoute.parent?.params
            .pipe(
                filter(isPresent),
                map(({ interval }: WeatherWidgetRoutingParams) => interval),
                filter(isPresent),
                filter((interval: OpenWeatherTemperatureInterval) => WEATHER_WIDGET_AVAILABLE_FORECAST_INTERVALS.includes(interval)),
                takeUntil(this.destroy$),
            )
            .subscribe((interval: OpenWeatherTemperatureInterval) => this.forecastInterval$.next(interval));
    }

    private initDataSourceStreams(): void {
        this.forecastInterval$
            .pipe(
                filter(isPresent),
                switchMap(() => this.weatherWidgetForecastStorageService.getAllForecasts$()),
                takeUntil(this.destroy$),
            )
            .subscribe((forecasts: WeatherWidgetForecaseStorageEntry[]) => {
                this.dataSource.data = forecasts.map((entry) => this.createDisplayItem(entry));
                this.changeDetectorRef.detectChanges();
            });

        this.weatherWidgetForecastStorageService.forecastLoaded$.pipe(takeUntil(this.destroy$)).subscribe((forecast: WeatherWidgetForecaseStorageEntry) => {
            this.dataSource.data.push(this.createDisplayItem(forecast));
            this.changeDetectorRef.detectChanges();
        });
    }

    private initColumnStreams(): void {
        this.columns$ = this.forecastInterval$.pipe(
            filter(isPresent),
            map((interval: OpenWeatherTemperatureInterval) => this.createColumns(interval)),
        );

        this.displayedColumns$ = this.columns$.pipe(map((columns: WeatherWidgetColumn[]) => columns.map((column) => column.columnDef)));
    }

    private createColumns(interval: OpenWeatherTemperatureInterval): WeatherWidgetColumn[] {
        const placeColumn = {
            columnDef: 'placeName',
            header: 'Place name',
            cell: (element: WeatherWidgetForecastDisplayItem) => element.placeName,
        };

        if (interval === OpenWeatherTemperatureInterval.Hourly) {
            return [placeColumn, ...this.createTimeColumns()];
        }

        return [placeColumn, ...this.createDayColumns()];
    }

    private createDayColumns(): WeatherWidgetColumn[] {
        return this.daysOfWeek.map((day: string, index: number) => ({
            columnDef: day.toLowerCase(),
            header: day,
            cell: (element: WeatherWidgetForecastDisplayItem) => element.temperatureMap.get(index)?.toString() ?? '',
        }));
    }

    private createTimeColumns(): WeatherWidgetColumn[] {
        return range(this.totalHoursInDay / this.displayHoursStep)
            .map((hour: number) => hour * this.displayHoursStep)
            .map((hour: number) => ({
                columnDef: hour.toString(),
                header: this.getFormattedHour(hour),
                cell: (element: WeatherWidgetForecastDisplayItem) => element.temperatureMap.get(hour)?.toString() ?? '',
            }));
    }

    private getFormattedHour(hour: number): string {
        return hour.toString() + ':00';
    }

    private createDisplayItem(entry: WeatherWidgetForecaseStorageEntry): WeatherWidgetForecastDisplayItem {
        // TODO: refactor to use strategy pattern to reduce algoritmic complexity.
        if (this.forecastInterval$.getValue() === OpenWeatherTemperatureInterval.Hourly) {
            return this.weatherWidgetForecastDisplayItemFactory.createHourlyDisplayItem(entry);
        }

        return this.weatherWidgetForecastDisplayItemFactory.createDailyDisplayItem(entry);
    }
}
