import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RequestCacheService {

    // cache duration can be modified when calling the request (cache duration can be different for each request)
    public set(cacheKey: string, body: object, cacheDuration: string) {
        localStorage.setItem(cacheKey, JSON.stringify({expiration: Date.now() + Number(cacheDuration), body}));
    }

    public get(cacheKey: string): any {
        const cachedItem = JSON.parse(localStorage.getItem(cacheKey));

        if (!cachedItem) {
            return null;
        }

        if (Date.now() > cachedItem.expiration) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return JSON.parse(localStorage.getItem(cacheKey));
    }

    public clearCache() {
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith('_cache_')) {
                localStorage.removeItem(key);
            }
        }
        alert('Request cache cleared!');
    }
}
