import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HospitalDetails } from './hospital-details';

@NgModule({
  declarations: [
    HospitalDetails,
  ],
  imports: [
    IonicPageModule.forChild(HospitalDetails),
  ],
  exports: [
    HospitalDetails,
  ]
})
export class HospitalDetailsModule {}
