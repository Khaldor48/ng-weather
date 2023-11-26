import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { routing } from "./app.routing";
import { environment } from '../environments/environment';
import { ZipcodeEntryComponent } from './views/blocks/zipcode-entry/zipcode-entry.component';
import { ForecastsListComponent } from './views/pages/forecasts-list/forecasts-list.component';
import { MainPageComponent } from './views/pages/main-page/main-page.component';
import { CurrentConditionsComponent } from './views/blocks/current-conditions/current-conditions.component';
import { CacheSettingComponent } from './views/blocks/cache-setting/cache-setting.component';
import { TabsModule } from './features/tabs/tabs.module';
import { CacheHttpInterceptor } from './features/request-cache/interceptors/cache-http.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        ZipcodeEntryComponent,
        ForecastsListComponent,
        CurrentConditionsComponent,
        MainPageComponent,
        CacheSettingComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        routing,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
        ReactiveFormsModule,
        TabsModule
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CacheHttpInterceptor,
            multi: true
        }
    ]
})
export class AppModule {
}
