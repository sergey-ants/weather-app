import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { OpenWeatherApiEndpointsService } from './open-weather-api/open-weather-api-endpoints.service';
import { OpenWeatherApiService } from './open-weather-api/open-weather-api.service';
import { OPEN_WEATHER_API_KEY } from './open-weather-api/tokens/open-weather-api-key';
import { WeatherWidgetComponent } from './weather-widget.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WeatherWidgetRoutingModule } from './weather-widget-routing.module';
import { WeatherWidgetForecastTableModule } from './weather-widget-forecast-table/weather-widget-forecast-table.module';
import { StoreModule } from '@ngrx/store';
import { WeatherWidgetPlaceStorageService } from './weather-widget-place-storage/weather-widget-place-storage.service';
import { WEATHER_WIDGET_PLACE_STORAGE_FEATURE_SELECTOR } from './weather-widget-place-storage/weather-widget-place-storage.selectors';
import { weatherWidgetPlaceStorageReducer } from './weather-widget-place-storage/weather-widget-place-storage.reducer';
import { WEATHER_WIDGET_FORECAST_STORAGE_FEATURE_SELECTOR } from './weather-widget-forecast-storage/weather-widget-forecast-storage.selectors';
import { weatherWidgetForecastStorageReducer } from './weather-widget-forecast-storage/weather-widget-forecast-storage.reducer';
import { WeatherWidgetForecastStorageService } from './weather-widget-forecast-storage/weather-widget-forecast-storage.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonToggleModule,
        WeatherWidgetRoutingModule,
        WeatherWidgetForecastTableModule,
        StoreModule.forFeature(WEATHER_WIDGET_PLACE_STORAGE_FEATURE_SELECTOR, weatherWidgetPlaceStorageReducer),
        StoreModule.forFeature(WEATHER_WIDGET_FORECAST_STORAGE_FEATURE_SELECTOR, weatherWidgetForecastStorageReducer),
    ],
    declarations: [WeatherWidgetComponent],
    exports: [WeatherWidgetComponent],
    providers: [
        OpenWeatherApiEndpointsService,
        OpenWeatherApiService,
        WeatherWidgetPlaceStorageService,
        WeatherWidgetForecastStorageService,
        {
            provide: OPEN_WEATHER_API_KEY,
            useValue: environment.openWeatherApiKey,
        },
    ],
})
export class WeatherWidgetModule {}
