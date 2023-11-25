import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Forecast } from '../views/pages/forecasts-list/forecast.type';
import { WEATHER_API_CONFIG } from '../configs/weather-api.config';
import { HttpClient, HttpContext } from '@angular/common/http';
import { CurrentConditions } from '../views/blocks/current-conditions/current-conditions.type';
import { CACHE } from '../configs/cache.config';

@Injectable({providedIn: 'root'})
export class WeatherHttpService {
    private http = inject(HttpClient);

    getForecast(zip: string): Observable<Forecast> {
        return this.http.get<Forecast>(`${WEATHER_API_CONFIG.URL}/forecast/daily?zip=${zip},us&units=imperial&cnt=5&APPID=${WEATHER_API_CONFIG.APPID}`, {context: this.createCacheContext()});
    }

    // example of defining custom cache duration (20 seconds)
    /*getForecast(zip: string): Observable<Forecast> {
        return this.http.get<Forecast>(`${WEATHER_API_CONFIG.URL}/forecast/daily?zip=${zip},us&units=imperial&cnt=5&APPID=${WEATHER_API_CONFIG.APPID}`, {context: this.createCacheContext(10 * 1000)}); // 10 seconds
    }*/

    getCurrentConditions(zip: string): Observable<CurrentConditions> {
        return this.http.get<CurrentConditions>(`${WEATHER_API_CONFIG.URL}/weather?zip=${zip},us&units=imperial&APPID=${WEATHER_API_CONFIG.APPID}`, {context: this.createCacheContext()});
    }

    createCacheContext(cacheDuration: number = CACHE.DURATION): HttpContext {
        return new HttpContext().set(CACHE.TOKEN, cacheDuration.toString());
    }
}
