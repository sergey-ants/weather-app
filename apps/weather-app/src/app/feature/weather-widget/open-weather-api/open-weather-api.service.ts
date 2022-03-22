import { Injectable } from '@angular/core';
import { OpenWeatherApiEndpointsService } from './open-weather-api-endpoints.service';
import { OpenWeatherTemperatureInterval } from 'app/feature/weather-widget/open-weather-api/enums/open-weather-temperature-interval';
import { HttpService } from '@core/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenWeatherPlaceDto } from './dto/open-weather-place-dto';
import { OpenWeatherForecastDto } from './dto/open-weather-forecast-dto';

@Injectable()
export class OpenWeatherApiService {
    constructor(private readonly openWeatherApiEndpointsService: OpenWeatherApiEndpointsService, private readonly httpService: HttpService) {}

    public fetchPlace$(placeName: string): Observable<OpenWeatherPlaceDto | undefined> {
        return this.httpService.get$<OpenWeatherPlaceDto[]>(this.openWeatherApiEndpointsService.getPlace(placeName)).pipe(
            map((places: OpenWeatherPlaceDto[]) => places[0]), // Only one unique pair [placeName: dto] should exist.
        );
    }

    public fetchWeatherForecast$(latitude: number, longitude: number, intervals: OpenWeatherTemperatureInterval[]): Observable<OpenWeatherForecastDto> {
        return this.httpService.get$(this.openWeatherApiEndpointsService.getWeatherForecast(latitude, longitude, intervals));
    }
}
