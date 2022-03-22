import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { WeatherWidgetForecastDisplayItemFactory } from './weather-widget-forecast-display-item-factory.service';
import { WeatherWidgetForecastTableComponent } from './weather-widget-forecast-table.component';

@NgModule({
    imports: [CommonModule, MatTableModule],
    declarations: [WeatherWidgetForecastTableComponent],
    exports: [WeatherWidgetForecastTableComponent],
    providers: [WeatherWidgetForecastDisplayItemFactory],
})
export class WeatherWidgetForecastTableModule {}
