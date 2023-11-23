import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const LOCATIONS: string = "locations";

@Injectable({providedIn: 'root'})
export class LocationService {

    #locations = new BehaviorSubject<string[]>([]);
    locations$ = this.#locations.asObservable();

    get locations(): string[] {
        return this.#locations.value;
    }

    constructor() {
        this.loadLocationsFromLocaleStorage();
    }

    private loadLocationsFromLocaleStorage() {
        let locationsString = localStorage.getItem(LOCATIONS);
        if (locationsString)
            this.#locations.next(JSON.parse(locationsString));
    }

    addLocation(zipcode: string) {
        const locations = [...this.locations];
        const index = locations.indexOf(zipcode);

        if (index === -1) {
            locations.push(zipcode);
            this.#locations.next(locations);
            this.saveLocationsToLocaleStorage();
        }
    }

    removeLocation(zipcode: string) {
        const locations = [...this.locations];
        const index = locations.indexOf(zipcode);

        if (index !== -1) {
            locations.splice(index, 1);
            this.#locations.next(locations);
            this.saveLocationsToLocaleStorage();
        }
    }

    removeLocations(zipcodes: string[]) {
        if (!zipcodes.length) {
            return;
        }

        const locations = [...this.locations];

        for (const zipcode of zipcodes) {
            const index = locations.indexOf(zipcode);

            if (index!== -1) {
                locations.splice(index, 1);
            }
        }

        this.#locations.next(locations);
        this.saveLocationsToLocaleStorage();
    }


    private saveLocationsToLocaleStorage() {
        localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
}
