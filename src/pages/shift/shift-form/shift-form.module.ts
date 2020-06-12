import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftForm } from './shift-form';
import { IonicSignaturePadModule, IonicsignaturepadComponent } from 'ionicsignaturepad';


@NgModule({
  declarations: [
    ShiftForm,
  ],
  imports: [
    IonicPageModule.forChild(ShiftForm),
    IonicSignaturePadModule
  ],
  exports: [
    ShiftForm,
    IonicsignaturepadComponent
  ]
})
export class ShiftFormModule {}
