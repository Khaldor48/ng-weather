import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from "../../../services/location.service";
import { ZipFormControlsEnum } from './enums/zip-form-controls.enum';

@Component({
    selector: 'app-zipcode-entry',
    templateUrl: './zipcode-entry.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZipcodeEntryComponent {
    // I created a basic reactive form, which, although not specified in the requirements, was implemented to enhance the user experience by enabling submission through the enter key.
    private readonly fb = inject(FormBuilder);
    protected readonly form = this.fb.group({
        [ZipFormControlsEnum.zipcode]: ['', Validators.required]
    });

    protected readonly ZipFormControlsEnum = ZipFormControlsEnum;

    constructor(private service: LocationService) {
    }

    addLocation(zipcode: string) {
        this.service.addLocation(zipcode);
    }

    onSubmit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.addLocation(this.form.value[ZipFormControlsEnum.zipcode]);
        }
    }
}
