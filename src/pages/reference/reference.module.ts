import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferencePage } from './reference';

@NgModule({
    declarations: [
        ReferencePage,
    ],
    imports: [
        IonicPageModule.forChild(ReferencePage)
    ],
    exports: [
        ReferencePage,
    ]
})
export class ReferenceModule { }
