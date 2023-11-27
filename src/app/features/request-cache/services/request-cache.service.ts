import { effect, Injectable, signal } from '@angular/core';
import { CachedItemInterface } from '../interfaces/cached-item.interface';
import { CacheSettingsInterface } from '../interfaces/cache-settings.interface';
import { CACHE } from '../configs/cache.config';

@Injectable({providedIn: 'root'})
export class RequestCacheService {
    cacheSettings = signal<CacheSettingsInterface>({} as CacheSettingsInterface);
    private storagePrefix = '_cache_';
    private settingsKey = `cache_settings`;

    constructor() {
        this.loadCacheSettings();
        this.clearExpiredCache();
        this.saveCacheSettingsOnChange();
    }

    public setCacheSettings(settings: CacheSettingsInterface) {
        this.cacheSettings.set(settings);
    }

    // cache duration can be modified when calling the request (cache duration can be different for each request)
    public set(cacheKey: string, body: object, cacheDuration: string) {
        // when duration is 0, then the global cache will be used
        if (cacheDuration === '0') {
            cacheDuration = (this.cacheSettings().duration * this.cacheSettings().multiplier).toString();
        }
        localStorage.setItem(cacheKey, JSON.stringify({expiration: Date.now() + Number(cacheDuration), body}));
    }

    public get(cacheKey: string): any {
        const cachedItem: CachedItemInterface = JSON.parse(localStorage.getItem(cacheKey));

        if (!cachedItem) {
            return null;
        }

        if (this.isExpired(cachedItem)) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return JSON.parse(localStorage.getItem(cacheKey));
    }

    public clearCache() {
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(this.storagePrefix)) {
                localStorage.removeItem(key);
            }
        }
        alert('Request cache cleared!');
    }

    public isExpired(cachedItem: CachedItemInterface) {
        return Date.now() > cachedItem.expiration
    }

    private loadCacheSettings() {
        const savedSettings = JSON.parse(localStorage.getItem(this.settingsKey));
        this.cacheSettings.set(savedSettings || {
            duration: CACHE.DURATION,
            multiplier: CACHE.MULTIPLIER
        });
    }

    private saveCacheSettingsOnChange() {
        effect(() => {
            const cacheSettings = this.cacheSettings();
            if (!cacheSettings.duration) {
                cacheSettings.duration = CACHE.DURATION;
            }
            if (!cacheSettings.multiplier) {
                cacheSettings.multiplier = CACHE.MULTIPLIER;
            }
            localStorage.setItem(this.settingsKey, JSON.stringify(this.cacheSettings()));
        });
    }

    private clearExpiredCache() {
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(this.storagePrefix)) {
                const cachedItem: CachedItemInterface = JSON.parse(localStorage.getItem(key));

                if (this.isExpired(cachedItem)) {
                    localStorage.removeItem(key);
                }
            }
        }
    }
}
