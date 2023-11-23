import { inject, Injectable, Signal, signal } from '@angular/core';
import { from, Observable, of } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { catchError, filter, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { WeatherApiErrorInterface } from './interfaces/weather-api-error.interface';

@Injectable({providedIn: 'root'})
export class WeatherService {

    static URL = 'http://api.openweathermap.org/data/2.5';
    static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
    static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
    #currentConditions = signal<ConditionsAndZip[]>([]);

    locationService = inject(LocationService);
    http = inject(HttpClient);

    locationsWithErrors: string[] = [];

    constructor() {
        this.setupLocationsListener();
    }

    /**
     * This aggregates locations which had error while fetching data, then removes them from locations service for preventing unnecessary error request (for non-existing locations)
     * It loads current conditions for each location (which is not already loaded) - refresh of already loaded locations is handled with interval on each location
     * Then it cleans up currentCondition, which are no longer needed, since location is no longer in locations service present
     * */
    private setupLocationsListener(): void {
        // No need to unsubscribe since this class is a singleton
        this.locationService.locations$.pipe(
            tap(() => this.locationsWithErrors = []),
            tap(this.cleanupCurrentCondition.bind(this)),
            switchMap((locations) => from(locations).pipe(
                filter((zip) => !this.#currentConditions().some((condition) => condition.zip === zip)),
                mergeMap((zip) => this.loadCurrentConditions(zip)),
                toArray()
            )),
            tap(() => {
                this.locationService.removeLocations(this.locationsWithErrors);
            })
        ).subscribe();
    }

    private cleanupCurrentCondition(locations: string[]): void {
        for (const condition of this.#currentConditions()) {
            if (locations.indexOf(condition.zip) === -1) {
                this.removeCurrentConditions(condition.zip);
            }
        }
    }

    private loadCurrentConditions(zip: string): Observable<CurrentConditions> {
        // We catch failed zipcodes and return of() to preserve stream
        return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zip},us&units=imperial&APPID=${WeatherService.APPID}`).pipe(
            catchError(({error}: HttpErrorResponse) => this.handleError(error, zip)),
            filter(Boolean),
            tap((data: CurrentConditions) => this.addCurrentConditions({zip, data}))
        );
    }

    private addCurrentConditions(newConditions: ConditionsAndZip): void {
        // We don't use mutate anymore since it has been removed, instead we use update for immutability
        this.#currentConditions.update((currentConditions) => {
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
        this.#currentConditions.update(currentConditions => {
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
        return this.#currentConditions.asReadonly();
    }

    getForecast(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
    }

    getWeatherIcon(id: number): string {
        if (id >= 200 && id <= 232)
            return WeatherService.ICON_URL + "art_storm.png";
        else if (id >= 501 && id <= 511)
            return WeatherService.ICON_URL + "art_rain.png";
        else if (id === 500 || (id >= 520 && id <= 531))
            return WeatherService.ICON_URL + "art_light_rain.png";
        else if (id >= 600 && id <= 622)
            return WeatherService.ICON_URL + "art_snow.png";
        else if (id >= 801 && id <= 804)
            return WeatherService.ICON_URL + "art_clouds.png";
        else if (id === 741 || id === 761)
            return WeatherService.ICON_URL + "art_fog.png";
        else
            return WeatherService.ICON_URL + "art_clear.png";
    }
}
