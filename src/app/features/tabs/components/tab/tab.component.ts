import { Component, ContentChild } from '@angular/core';
import { TabHeaderDirective } from '../../directives/tab-header.directive';
import { TabBodyDirective } from '../../directives/tab-body.directive';

@Component({
    selector: 'app-tab',
    template: '', // template is required from angular but not for our implementation, where this component is used as container for tabs and template are added dynamically for full-customization purposes
    styleUrls: ['./tab.component.scss']
})
export class TabComponent {
    @ContentChild(TabHeaderDirective) header: TabHeaderDirective;
    @ContentChild(TabBodyDirective) body: TabBodyDirective;
}
