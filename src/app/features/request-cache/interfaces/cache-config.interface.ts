import { HttpContextToken } from '@angular/common/http';

export interface CacheConfigInterface {
    DURATION: number;
    MULTIPLIER: number;
    TOKEN: HttpContextToken<string>;
}
