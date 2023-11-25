import { HttpContextToken } from '@angular/common/http';
import { CacheConfigInterface } from '../interfaces/cache-config.interface';

export const CACHE: CacheConfigInterface = {
    DURATION: 2 * 60 * 60 * 1000, // 2 hours
    TOKEN: new HttpContextToken(() => 'CACHE_TOKEN'),
}
