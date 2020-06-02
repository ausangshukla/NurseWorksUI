import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactDetails } from './contact-details';

@NgModule({
    declarations: [
        ContactDetails,
    ],
    imports: [
        IonicPageModule.forChild(ContactDetails)
    ],
    exports: [
        ContactDetails,
    ]
})
export class ContactDetailsModule {}
