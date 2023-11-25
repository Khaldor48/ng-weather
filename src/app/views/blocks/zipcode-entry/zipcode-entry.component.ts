import { Component, inject } from '@angular/core';
import { LocationService } from "../../../services/location.service";
import { FormBuilder, Validators } from '@angular/forms';
import { ZipFormControlsEnum } from './zip-form-controls.enum';

@Component({
    selector: 'app-zipcode-entry',
    templateUrl: './zipcode-entry.component.html'
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

    public onSubmit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.addLocation(this.form.value[ZipFormControlsEnum.zipcode]);
        }
    }
}
