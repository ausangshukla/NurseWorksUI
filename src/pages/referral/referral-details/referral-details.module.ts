import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferralDetails } from '../referral-details/referral-details';

@NgModule({
    declarations: [
        ReferralDetails,
    ],
    imports: [
        IonicPageModule.forChild(ReferralDetails)
    ],
    exports: [
        ReferralDetails,
    ]
})
export class ReferralDetailsModule {}
