import { Directive, TemplateRef } from '@angular/core';
import { TabTemplateContextInterface } from '../interface/tab-template-context.interface';

@Directive({
    selector: '[appTabBody]'
})
export class TabBodyDirective {
    constructor(public template: TemplateRef<TabTemplateContextInterface>) {
    }
}
