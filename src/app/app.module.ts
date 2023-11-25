import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from "./app.routing";

import { ZipcodeEntryComponent } from './views/blocks/zipcode-entry/zipcode-entry.component';
import { ForecastsListComponent } from './views/pages/forecasts-list/forecasts-list.component';
import { CurrentConditionsComponent } from './views/blocks/current-conditions/current-conditions.component';

import { environment } from '../environments/environment';
import { MainPageComponent } from './views/pages/main-page/main-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TabsModule } from './features/tabs/tabs.module';

@NgModule({
    declarations: [
        AppComponent,
        ZipcodeEntryComponent,
        ForecastsListComponent,
        CurrentConditionsComponent,
        MainPageComponent,
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
    bootstrap: [AppComponent]
})
export class AppModule {
}
