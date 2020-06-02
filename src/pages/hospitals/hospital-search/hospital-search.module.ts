import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HospitalSearch } from './hospital-search';

@NgModule({
  declarations: [
    HospitalSearch,
  ],
  imports: [
    IonicPageModule.forChild(HospitalSearch),
  ],
  exports: [
    HospitalSearch,
  ]
})
export class HospitalSearchModule {}
