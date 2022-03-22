import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WEATHER_WIDGET_ROUTING_PATH } from '../feature/weather-widget/weather-widget-routing-path';

const routes: Routes = [
    {
        path: '',
        redirectTo: WEATHER_WIDGET_ROUTING_PATH,
        pathMatch: 'full',
    },
    {
        path: WEATHER_WIDGET_ROUTING_PATH,
        loadChildren: () => import('../feature/weather-widget/weather-widget.module').then((m) => m.WeatherWidgetModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
