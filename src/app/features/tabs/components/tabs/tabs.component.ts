import {
    AfterContentInit,
    Component,
    ContentChildren,
    DestroyRef,
    inject,
    Input,
    QueryList,
    signal
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    destroyRef = inject(DestroyRef);

    activatedTabIndex$$ = signal<number>(0);

    @Input() set activatedTabIndex(tabIndex: number) {
        this.activatedTabIndex$$.set(tabIndex ?? 0);
    }

    // When you have activated last tab, and it gets removed, we need to go adjust tab index, otherwise you'll be stuck with no tab activated
    ngAfterContentInit() {
        this.handleTabChanges();
    }

    handleTabChanges() {
        this.tabs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedTabs: QueryList<TabComponent>) => {
            if (this.activatedTabIndex$$() + 1 > updatedTabs.length) {
                const updatedIndex = updatedTabs.length - 1;
                this.activatedTabIndex$$.set(updatedIndex >= 0 ? updatedIndex : 0);
            }
        });
    }
}
