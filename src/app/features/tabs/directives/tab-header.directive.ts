import { Directive, TemplateRef } from '@angular/core';
import { TabTemplateContextInterface } from '../interface/tab-template-context.interface';

@Directive({
    selector: '[appTabHeader]'
})
export class TabHeaderDirective {
    constructor(public template: TemplateRef<TabTemplateContextInterface>) {
    }
}
