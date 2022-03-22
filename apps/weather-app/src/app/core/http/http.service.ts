import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { delay, Observable, retryWhen, switchMap, throwError } from 'rxjs';

@Injectable()
export class HttpService {
    constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {}

    public get$<T>(url: string, params?: HttpParams, retryDelay = 1000): Observable<T> {
        return this.httpClient.get<T>(url, { params }).pipe(
            retryWhen((errors$: Observable<HttpErrorResponse>) =>
                errors$.pipe(
                    delay(retryDelay),
                    switchMap((error: HttpErrorResponse) => throwError(() => error)),
                ),
            ),
        );
    }
}
