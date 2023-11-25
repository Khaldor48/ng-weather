import { NgModule } from '@angular/core';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';
import { TabBodyDirective } from './directives/tab-body.directive';
import { TabHeaderDirective } from './directives/tab-header.directive';
import { NgForOf, NgTemplateOutlet } from '@angular/common';

@NgModule({
    declarations: [TabsComponent, TabComponent, TabBodyDirective, TabHeaderDirective],
    imports: [
        NgForOf,
        NgTemplateOutlet
    ],
    exports: [TabsComponent, TabComponent, TabBodyDirective, TabHeaderDirective]
})
export class TabsModule {

}
