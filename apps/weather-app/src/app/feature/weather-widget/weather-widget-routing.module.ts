import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherWidgetComponent } from './weather-widget.component';
import { WEATHER_WIDGET_FORECAST_TABLE_ROUTING_PATH } from './weather-widget-forecast-table/weather-widget-forecast-table-routing-path';
import { WeatherWidgetRoutingParam } from './enums/weather-widget-routing-param';
import { OpenWeatherTemperatureInterval } from './open-weather-api/enums/open-weather-temperature-interval';
import { WeatherWidgetForecastTableComponent } from './weather-widget-forecast-table/weather-widget-forecast-table.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: OpenWeatherTemperatureInterval.Hourly,
    },
    {
        path: `:${WeatherWidgetRoutingParam.Interval}`,
        component: WeatherWidgetComponent,
        children: [
            {
                path: WEATHER_WIDGET_FORECAST_TABLE_ROUTING_PATH,
                component: WeatherWidgetForecastTableComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WeatherWidgetRoutingModule {}
