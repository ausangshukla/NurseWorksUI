import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftReject } from './shift-reject';

@NgModule({
  declarations: [
    ShiftReject,
  ],
  imports: [
    IonicPageModule.forChild(ShiftReject),
  ],
  exports: [
    ShiftReject,
  ]
})
export class ShiftRejectModule {}
