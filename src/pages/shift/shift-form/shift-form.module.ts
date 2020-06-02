import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftForm } from './shift-form';

@NgModule({
  declarations: [
    ShiftForm,
  ],
  imports: [
    IonicPageModule.forChild(ShiftForm),
  ],
  exports: [
    ShiftForm,
  ]
})
export class ShiftFormModule {}
