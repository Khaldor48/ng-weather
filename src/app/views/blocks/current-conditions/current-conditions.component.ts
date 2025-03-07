import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Router } from "@angular/router";
import { WeatherService } from "../../../services/weather.service";
import { LocationService } from "../../../services/location.service";
import { ConditionsAndZip } from '../../../types/conditions-and-zip.type';

@Component({
    selector: 'app-current-conditions',
    templateUrl: './current-conditions.component.html',
    styleUrls: ['./current-conditions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsComponent {
    tabsIdentifier = 'current-conditions';

    private router = inject(Router);
    protected weatherService = inject(WeatherService);
    protected locationService = inject(LocationService);
    protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

    protected currentConditionsByZipTrackBy(index: number, item: ConditionsAndZip): string {
        return item.zip;
    }

    showForecast(zipcode: string) {
        this.router.navigate(['/forecast', zipcode])
    }
}
