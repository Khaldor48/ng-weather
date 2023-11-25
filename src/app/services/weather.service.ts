import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, filter, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

import { CurrentConditions } from '../views/blocks/current-conditions/current-conditions.type';
import { Forecast } from '../views/pages/forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { ConditionsAndZip } from '../types/conditions-and-zip.type';
import { WeatherApiErrorInterface } from '../interfaces/weather-api-error.interface';
import { WEATHER_API_CONFIG } from '../configs/weather-api.config';

@Injectable({providedIn: 'root'})
export class WeatherService {

    currentConditions = signal<ConditionsAndZip[]>([]);
    private locationService = inject(LocationService);
    private http = inject(HttpClient);
    private locationsWithErrors: string[] = [];

    constructor() {
        this.listenToLocationChanges();
    }

    /**
     * Listens to changes in locations and updates current conditions accordingly.
     * - Removes current conditions for locations no longer present in the location service.
     * - Fetches current conditions for new locations not already loaded. Refreshing of existing locations is managed separately.
     * - Tracks locations with errors during data fetching and removes them from the location service to prevent future errors.
     */
    private listenToLocationChanges(): void {
        this.locationService.locations$.pipe(
            tap(() => this.locationsWithErrors = []),
            tap((locations) => this.removeNotNeededConditions(locations)),
            switchMap(locations => this.loadConditionsForNewLocations(locations)),
            tap(() => this.locationService.removeLocations(this.locationsWithErrors))
        ).subscribe();
    }

    private loadConditionsForNewLocations(locations: string[]): Observable<CurrentConditions[]> {
        return from(locations).pipe(
            filter(zip => !this.currentConditions().some(condition => condition.zip === zip)),
            mergeMap(zip => this.fetchCurrentConditions(zip)),
            toArray(),
        );
    }

    private removeNotNeededConditions(locations: string[]): void {
        for (const condition of this.currentConditions()) {
            if (locations.indexOf(condition.zip) === -1) {
                this.removeCurrentConditions(condition.zip);
            }
        }
    }

    private fetchCurrentConditions(zip: string): Observable<CurrentConditions> {
        // We catch failed zipcodes and return of() to preserve stream
        return this.http.get<CurrentConditions>(`${WEATHER_API_CONFIG.URL}/weather?zip=${zip},us&units=imperial&APPID=${WEATHER_API_CONFIG.APPID}`).pipe(
            catchError(({error}: HttpErrorResponse) => this.handleError(error, zip)),
            filter(Boolean),
            tap((data: CurrentConditions) => this.addCurrentConditions({zip, data}))
        );
    }

    private addCurrentConditions(newConditions: ConditionsAndZip): void {
        // We don't use mutate anymore since it has been removed, instead we use update for immutability
        this.currentConditions.update((currentConditions) => {
            const index = currentConditions.findIndex((currentCondition) => currentCondition.zip === newConditions.zip)

            // This could be one-liners, but I prefer to wrap it for better readability
            if (index !== -1) {
                currentConditions[index] = newConditions;
            } else {
                currentConditions.push(newConditions);
            }

            return currentConditions;
        })
    }

    removeCurrentConditions(zip: string): void {
        // We don't use mutate anymore since it has been removed, instead we use update for immutability
        this.currentConditions.update(currentConditions => {
            const index = currentConditions.findIndex((currentCondition) => currentCondition.zip === zip)

            if (index !== -1) {
                currentConditions.splice(index, 1);
            }

            return currentConditions;
        })
    }

    handleError(error: WeatherApiErrorInterface, zipcode: string): Observable<void> {
        const errorText = `Error(${error.cod}) occurred while loading zipcode: ${zipcode} - message: ${error.message}`;
        alert(errorText);
        console.error(errorText);
        this.locationsWithErrors.push(zipcode);
        return of();
    }

    getCurrentConditions(): Signal<ConditionsAndZip[]> {
        return this.currentConditions.asReadonly();
    }

    getForecast(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        return this.http.get<Forecast>(`${WEATHER_API_CONFIG.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WEATHER_API_CONFIG.APPID}`);
    }

    getWeatherIcon(id: number): string {
        if (id >= 200 && id <= 232)
            return WEATHER_API_CONFIG.ICON_URL + "art_storm.png";
        else if (id >= 501 && id <= 511)
            return WEATHER_API_CONFIG.ICON_URL + "art_rain.png";
        else if (id === 500 || (id >= 520 && id <= 531))
            return WEATHER_API_CONFIG.ICON_URL + "art_light_rain.png";
        else if (id >= 600 && id <= 622)
            return WEATHER_API_CONFIG.ICON_URL + "art_snow.png";
        else if (id >= 801 && id <= 804)
            return WEATHER_API_CONFIG.ICON_URL + "art_clouds.png";
        else if (id === 741 || id === 761)
            return WEATHER_API_CONFIG.ICON_URL + "art_fog.png";
        else
            return WEATHER_API_CONFIG.ICON_URL + "art_clear.png";
    }
}
