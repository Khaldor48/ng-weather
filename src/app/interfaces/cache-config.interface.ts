import { HttpContextToken } from '@angular/common/http';

export interface CacheConfigInterface {
    DURATION: number;
    TOKEN: HttpContextToken<string>;
}
