import { WeatherWidgetForecastDisplayItem } from './weather-widget-forecast-display-item';

export interface WeatherWidgetColumn {
    columnDef: string;
    header: string;
    cell: (element: WeatherWidgetForecastDisplayItem) => string;
}
