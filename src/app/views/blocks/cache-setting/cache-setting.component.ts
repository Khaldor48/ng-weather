import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { RequestCacheService } from '../../../features/request-cache/services/request-cache.service';
import { CACHE_MULTIPLIER } from '../../../features/request-cache/configs/cache-multipliers.config';
import { CacheSettingsInterface } from '../../../features/request-cache/interfaces/cache-settings.interface';
import { ZipFormControlsEnum } from '../zipcode-entry/enums/zip-form-controls.enum';

@Component({
    selector: 'app-cache-setting',
    templateUrl: './cache-setting.component.html',
    styleUrls: ['./cache-setting.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CacheSettingComponent implements OnInit {
    public multipliers: { value: string, viewValue: string }[] = Object.keys(CACHE_MULTIPLIER).map(key => ({
        viewValue: key.toLowerCase(),
        value: CACHE_MULTIPLIER[key]
    }));
    protected requestCacheService = inject(RequestCacheService);
    protected cacheDuration = new FormControl(this.cacheSettings.duration, Validators.required);
    protected cacheMultiplier = new FormControl(this.cacheSettings.multiplier, Validators.required);
    protected readonly ZipFormControlsEnum = ZipFormControlsEnum;
    private destroyRef = inject(DestroyRef);

    get cacheSettings(): CacheSettingsInterface {
        return this.requestCacheService.cacheSettings();
    }

    ngOnInit() {
        merge(
            this.cacheDuration.valueChanges,
            this.cacheMultiplier.valueChanges
        ).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(
            () => this.requestCacheService.setCacheSettings({
                duration: this.cacheDuration.value,
                multiplier: this.cacheMultiplier.value
            })
        );
    }
}
