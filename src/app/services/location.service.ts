import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const LOCATIONS_KEY: string = "locations";

@Injectable({providedIn: 'root'})
export class LocationService {
    readonly #locationsSubject = new BehaviorSubject<string[]>([]);
    locations$ = this.#locationsSubject.asObservable();

    get locations(): string[] {
        return this.#locationsSubject.value;
    }

    constructor() {
        this.loadLocationsFromLocalStorage();
    }

    private loadLocationsFromLocalStorage(): void {
        const locationsString = localStorage.getItem(LOCATIONS_KEY);
        // This could be one-liner, but I prefer to wrap it for better readability
        if (locationsString) {
            this.#locationsSubject.next(JSON.parse(locationsString));
        }
    }

    addLocation(zipcode: string): void {
        const locations = new Set(this.locations);
        if (!locations.has(zipcode)) {
            this.updateLocations([...locations, zipcode]);
        } else {
            alert(`${zipcode} is already in the list of locations`);
        }
    }

    removeLocation(zipcode: string): void {
        const locations = new Set(this.locations);
        if (locations.delete(zipcode)) {
            this.updateLocations([...locations]);
        }
    }

    removeLocations(zipcodes: string[]): void {
        const locations = new Set(this.locations);
        let updated = false;

        for (const zipcode of zipcodes) {
            if (locations.delete(zipcode)) {
                updated = true;
            }
        }

        if (updated) {
            this.updateLocations([...locations]);
        }
    }

    private updateLocations(locations: string[]): void {
        this.#locationsSubject.next(locations);
        this.saveLocationsToLocalStorage();
    }

    private saveLocationsToLocalStorage(): void {
        localStorage.setItem(LOCATIONS_KEY, JSON.stringify(this.locations));
    }
}
