import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, switchMap } from 'rxjs/operators';
import { asyncScheduler, of } from 'rxjs';
import { WeatherService } from '../../../services/weather.service';
import { Forecast } from './forecast.type';

@Component({
    selector: 'app-forecasts-list',
    templateUrl: './forecasts-list.component.html',
    styleUrls: ['./forecasts-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastsListComponent {

    router = inject(Router);
    protected weatherService = inject(WeatherService);
    private activatedRoute = inject(ActivatedRoute);
    forecast = toSignal<Forecast | null>(this.fetchForecast());

    private fetchForecast() {
        return this.activatedRoute.params.pipe(
            map((params) => params['zipcode']),
            switchMap((zipCode: string) =>
                this.weatherService.fetchForecast(zipCode).pipe(
                    catchError((error) => {
                        console.error(error);
                        this.router.navigate(['/']);
                        // running as macro task, because we want to first finish navigation and then fire alert message
                        // this won't be necessary if we have some separate message service (toastr etc.), I did it for purposes of using alert which blocks execution
                        asyncScheduler.schedule(() => {
                            alert(error);
                        });
                        return of();
                    })
                )
            )
        );
    }
}
