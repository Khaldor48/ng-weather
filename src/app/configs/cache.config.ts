import { HttpContextToken } from '@angular/common/http';
import { CacheConfigInterface } from '../interfaces/cache-config.interface';

/**
 * Cache duration can be set directly in request, see weather-http.service.ts for an example.
 * If no cache duration is set, the default cache duration (defined in this constant) will be used.
 * */
export const CACHE: CacheConfigInterface = {
    // DURATION: 10 * 1000, // 10 seconds
    DURATION: 2 * 60 * 60 * 1000, // 2 hours
    TOKEN: new HttpContextToken(() => 'CACHE_TOKEN'),
}
