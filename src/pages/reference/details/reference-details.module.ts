import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferenceDetails } from './reference-details';

@NgModule({
    declarations: [
        ReferenceDetails,
    ],
    imports: [
        IonicPageModule.forChild(ReferenceDetails)
    ],
    exports: [
        ReferenceDetails,
    ]
})
export class ReferenceDetailsModule { }
