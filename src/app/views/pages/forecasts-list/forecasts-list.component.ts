import { Component, inject } from '@angular/core';
import { WeatherService } from '../../../services/weather.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Forecast } from './forecast.type';
import { asyncScheduler } from 'rxjs';

@Component({
    selector: 'app-forecasts-list',
    templateUrl: './forecasts-list.component.html',
    styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

    zipcode: string;
    forecast: Forecast;

    router = inject(Router);
    protected weatherService = inject(WeatherService);
    private activatedRoute = inject(ActivatedRoute);

    constructor() {
        this.fetchForecast();
    }

    private fetchForecast() {
        this.activatedRoute.params.subscribe(params => {
            this.zipcode = params['zipcode'];
            this.weatherService.fetchForecast(this.zipcode)
                .subscribe({
                    next: (forecast: Forecast) => {
                        this.forecast = forecast;
                    },
                    error: async (error: string) => {
                        console.error(error);
                        await this.router.navigate(['/']);
                        // running as macro task, because we want to first finish navigation and then fire alert message
                        // this won't be necessary if we have some separate message service (toastr etc.), I did it for purposes of using alert which blocks execution
                        asyncScheduler.schedule(() => {
                            alert(error);
                        });
                    }
                });
        });
    }
}
