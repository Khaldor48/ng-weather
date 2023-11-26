import {
    AfterContentInit,
    Component,
    ContentChildren,
    DestroyRef, effect,
    inject, Injector,
    Input, OnInit,
    QueryList,
    signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TabComponent } from '../tab/tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterContentInit {
    tabStoragePrefix = 'tabs';

    /**
     * If you set this identifier to some string token, app will remember the activated tab
     * */
    @Input() tabsIdentifier: string;

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    injector = inject(Injector);
    destroyRef = inject(DestroyRef);

    activatedTabIndex$$ = signal<number>(0);

    @Input() set activatedTabIndex(tabIndex: number) {
        this.activatedTabIndex$$.set(tabIndex ?? 0);
    }

    ngOnInit() {
        if (this.tabsIdentifier) {
            const storedActivatedTabIndex = localStorage.getItem(this.getStorageKey());
            if (storedActivatedTabIndex) {
                this.activatedTabIndex$$.set(JSON.parse(storedActivatedTabIndex));
            }
            effect(() => {
                localStorage.setItem(this.getStorageKey(), JSON.stringify(this.activatedTabIndex$$()));
            }, { injector: this.injector });
        }
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

    getStorageKey() {
        return `${this.tabStoragePrefix}_${this.tabsIdentifier}`;
    }
}
