import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HospitalBankingDetails } from './hospital-banking-details';

@NgModule({
  declarations: [
    HospitalBankingDetails,
  ],
  imports: [
    IonicPageModule.forChild(HospitalBankingDetails),
  ],
  exports: [
    HospitalBankingDetails,
  ]
})
export class HospitalBankingDetailsModule {}
