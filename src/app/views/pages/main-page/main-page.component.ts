import { Component, inject } from '@angular/core';
import { RequestCacheService } from '../../../services/request-cache.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  protected cacheService = inject(RequestCacheService);
}
