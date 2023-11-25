import { NgModule } from '@angular/core';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';
import { TabBodyDirective } from './directives/tab-body.directive';
import { TabHeaderDirective } from './directives/tab-header.directive';
import { NgForOf, NgTemplateOutlet } from '@angular/common';

const declarations = [TabsComponent, TabComponent, TabBodyDirective, TabHeaderDirective];

@NgModule({
    imports: [
        NgForOf,
        NgTemplateOutlet
    ],
    declarations: declarations,
    exports: declarations
})
export class TabsModule {

}
