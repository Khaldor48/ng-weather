import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { MonoTypeOperatorFunction, Observable, of, pipe } from 'rxjs';
import { CACHE } from '../configs/cache.config';
import { filter, tap } from 'rxjs/operators';
import { RequestCacheService } from '../services/request-cache.service';

@Injectable()
export class CacheHttpInterceptor implements HttpInterceptor {
    cacheService = inject(RequestCacheService);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.context.has(CACHE.TOKEN)) {
            const cacheKey = `_cache_${encodeURIComponent(request.url)}`;
            const cachedItem = this.cacheService.get(cacheKey);

            if (cachedItem?.body) {
                return of(new HttpResponse({body: cachedItem.body, status: 200}));
            }

            return next.handle(request).pipe(
                this.cacheResponse(cacheKey, request.context.get(CACHE.TOKEN))
            );
        }
        return next.handle(request);
    }

    cacheResponse(cacheKey: string, cacheDuration: string): MonoTypeOperatorFunction<HttpEvent<unknown>> {
        return pipe(
            filter((event: HttpEvent<unknown>) => event instanceof HttpResponse),
            tap((response: HttpResponse<any>) => {
                this.cacheService.set(cacheKey, response.body, cacheDuration);
            })
        );
    }
}
