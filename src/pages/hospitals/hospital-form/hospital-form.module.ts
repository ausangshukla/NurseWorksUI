import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HospitalForm } from './hospital-form';

@NgModule({
  declarations: [
    HospitalForm,
  ],
  imports: [
    IonicPageModule.forChild(HospitalForm),
  ],
  exports: [
    HospitalForm,
  ]
})
export class HospitalFormModule {}
