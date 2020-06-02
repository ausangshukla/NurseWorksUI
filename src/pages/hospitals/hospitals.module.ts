import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Hospitals } from './hospitals';

@NgModule({
  declarations: [
    Hospitals,
  ],
  imports: [
    IonicPageModule.forChild(Hospitals),
  ],
  exports: [
    Hospitals,
  ]
})
export class HospitalsModule {}
