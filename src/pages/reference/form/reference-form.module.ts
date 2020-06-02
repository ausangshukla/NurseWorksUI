import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferenceForm } from './reference-form';

@NgModule({
    declarations: [
        ReferenceForm,
    ],
    imports: [
        IonicPageModule.forChild(ReferenceForm)
    ],
    exports: [
        ReferenceForm,
    ]
})
export class ReferenceFormModule { }
