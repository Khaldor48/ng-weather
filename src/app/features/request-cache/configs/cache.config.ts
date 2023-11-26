import { HttpContextToken } from '@angular/common/http';
import { CacheConfigInterface } from '../interfaces/cache-config.interface';
import { CACHE_MULTIPLIER } from './cache-multipliers.config';

/**
 * Cache duration can be modified in cache setting on the page directly (testing purposes)
 * Cache duration can be further set directly in request, see weather-http.service.ts for an example.
 * So different request can have different cache durations no matter what global setting is
 * */
export const CACHE: CacheConfigInterface = {
    DURATION: 2, // this is default setting for cache setting input
    MULTIPLIER: CACHE_MULTIPLIER.HOURS, // this is default setting for cache setting input
    TOKEN: new HttpContextToken(() => 'CACHE_TOKEN'),
}
