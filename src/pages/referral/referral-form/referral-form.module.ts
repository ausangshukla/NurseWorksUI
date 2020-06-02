import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferralForm } from './referral-form';

@NgModule({
    declarations: [
        ReferralForm,
    ],
    imports: [
        IonicPageModule.forChild(ReferralForm)
    ],
    exports: [
        ReferralForm,
    ]
})
export class ReferralFormModule {}
